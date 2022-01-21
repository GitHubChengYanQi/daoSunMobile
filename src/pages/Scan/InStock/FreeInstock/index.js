import React, { useEffect, useRef, useState } from 'react';
import { Card, Dialog, FloatingBubble, List, Toast } from 'antd-mobile';
import Search from './components/Search';
import { storehousePositionsTreeView } from '../../Url';
import { request, useRequest } from '../../../../util/Request';
import { connect } from 'dva';
import { MyLoading } from '../../../components/MyLoading';
import LinkButton from '../../../components/LinkButton';
import { useBoolean, useDebounceEffect, useSetState } from 'ahooks';
import { ScanOutlined } from '@ant-design/icons';
import { getHeader } from '../../../components/GetHeader';
import BottomButton from '../../../components/BottomButton';
import MyCascader from '../../../components/MyCascader';
import IsDev from '../../../../components/IsDev';
import PrintCode from '../../../components/PrintCode';
import { batchBind, storehousePositionsDetail } from '../components/Url';
import SkuResultSkuJsons from '../../Sku/components/SkuResult_skuJsons';
import Skus from './components/Skus';
import AddSku from './components/AddSku';
import { AddOutline } from 'antd-mobile-icons';
import MyEmpty from '../../../components/MyEmpty';

const fontSize = 20;

const FreeInstock = (props) => {

  const [params, setParams] = useSetState({ data: [] });

  const [state, { setTrue, setFalse }] = useBoolean();

  const getSkuData = (type) => {
    const skus = [];
    params.data.map((item) => {
      return item.map((item) => {
        return skus.push(item);
      });
    });
    switch (type) {
      case 'skus':
        // 当前所有物料
        return skus;
      case 'inkind':
        // 已生成的实物
        return skus.filter((item) => {
          return item.inkindId;
        }).map((item) => {
          return item.inkindId;
        });
      case 'skuItems':
        // 没有生成实物的物料
        return skus.filter((item) => {
          return !item.inkindId && (item.brandId && item.customerId && item.number);
        }).map((item) => {
          return {
            source: 'item',
            brandId: item.brandId,
            customerId: item.customerId,
            id: item.skuId,
            number: item.number,
            inkindType: '自由入库',
          };
        });
      case 'errorNumber':
        // 数量是否有问题
        const skuNumbers = skus.filter((item) => {
          return item.number > 0;
        });
        return skuNumbers.length !== skus.length;
      case 'brandOrCustomer':
        // 品牌或者供应商是否有问题
        return skus.filter((item) => {
          return !item.brandId || !item.customerId;
        }).length > 0;
      default:
        return null;
    }
  };

  const [data, setData] = useSetState({
    skus: [],
    postionId: null,
    storehouse: {},
  });

  useEffect(() => {
    detailRun({
      data: {
        storehousePositionsId: '1480351037381472258',
      },
    });
  }, []);

  const ref = useRef();
  const treeRef = useRef();

  const codeId = props.qrCode && props.qrCode.codeId;

  const [visible, setVisible] = useState();

  const clearCode = () => {
    props.dispatch({
      type: 'qrCode/clearCode',
    });
  };

  const { loading: detailLoading, run: detailRun } = useRequest(
    storehousePositionsDetail,
    {
      manual: true,
      onSuccess: (res) => {
        setData({
          ...data, skus: res.skuResults.map((item) => {
            return {
              batch: item.batch === 1,
              skuId: item.skuId,
              skuResult: <SkuResultSkuJsons skuResult={item} />,
            };
          }),
        });
      },
    },
  );

  const { loading: CodeLoading, run: CodeRun } = useRequest(
    batchBind,
    {
      manual: true,
    },
  );

  const { loading, run: codeRun } = useRequest({
    url: '/orCode/backObject',
    method: 'GET',
  }, {
    manual: true,
    onSuccess: (res) => {
      switch (res.type) {
        case 'storehousePositions':
          if (res.result && res.result.storehouseResult) {
            setData({
              ...data,
              storehouse: {
                label: res.result.storehouseResult.name,
                value: res.result.storehouseResult.storehouseId,
              },
              postionId: res.result.storehousePositionsId,
            });
          }
          detailRun({
            data: {
              storehousePositionsId: res.result.storehousePositionsId,
            },
          });
          clearCode();
          break;
        default:
          Toast.show({
            content: '请扫库位码！',
            position: 'bottom',
          });
          clearCode();
          break;
      }
    },
  });

  useDebounceEffect(() => {
    if (codeId && codeId !== '') {
      codeRun({
        params: {
          id: codeId,
        },
      });
    }
  }, [codeId], {
    wait: 0,
  });


  const addCanvas = async (inkindIds) => {
    if (IsDev() || !getHeader()) {
      const templete = await request({
        url: '/inkind/details',
        method: 'POST',
        data: {
          inkindIds,
        },
      });
      if (templete && Array.isArray(templete)) {
        PrintCode.print(templete && templete.map((items) => {
          return items.printTemplateResult && items.printTemplateResult.templete;
        }), 0);
      }
    }
  };


  const clear = () => {
    setFalse();
    setData({
      skus: [],
      postionId: null,
      storehouse: {},
    });
  };

  const { loading: instockLoading, run: instockRun } = useRequest({
    url: '/instockOrder/freeInstock',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: () => {
      Dialog.show({
        title: '入库成功',
        content: '是否保留此页面？',
        closeOnAction: true,
        onAction: (action) => {
          if (action.key === 'no') {
            clear();
          } else {
            setTrue();
          }
        },
        actions: [
          [
            {
              key: 'ok',
              text: '是',
            },
            {
              key: 'no',
              text: '继续入库',
            },
          ],
        ],
      });
    },
    onError: () => {
      Dialog.alert({
        content: '入库失败！',
      });
    },
  });

  const printAllCode = async () => {
    const inkindIds = getSkuData('inkind');
    const codeRequests = getSkuData('skuItems');

    const res = codeRequests.length > 0 ? await CodeRun({
      data: {
        codeRequests,
      },
    }) : [];

    const printInkinds = res.map((item) => {
      return item.inkindId;
    });

    const printCodes = [...inkindIds, ...printInkinds];

    let i = 0;
    const array = params.data.map((item) => {
      return item.map((value) => {
        if (!value.inkindId && value.brandId && value.customerId && value.number) {
          i++;
          return {
            ...value,
            inkindId: printInkinds[i - 1],
          };
        } else {
          return value;
        }
      });
    });
    setParams({ data: array });
    addCanvas(printCodes);
    return printCodes;
  };

  return <>
    <Card
      title='库位信息'
      extra={<LinkButton title='清除' onClick={()=>{
        clear();
      }} />}
    >
      <List
        style={{
          '--border-top': 'none',
          '--border-bottom': 'none',
        }}
      >
        <List.Item title='仓库'>
          <LinkButton
            style={{ width: '100vw', fontSize, textAlign: 'left', color: !data.storehouse.label && 'red' }}
            title={
              data.storehouse.label || '请选择仓库'
            } onClick={() => {
            ref.current.search({ type: 'storehouse' });
          }} />
        </List.Item>
        <List.Item title='库位' extra={getHeader() && <LinkButton
          title={<ScanOutlined />} onClick={() => {
          props.dispatch({
            type: 'qrCode/wxCpScan',
            payload: {
              action: 'freeInstock',
            },
          });
        }} />}>
          <MyCascader
            arrow={false}
            ref={treeRef}
            fontStyle={{ fontSize }}
            branch={!data.storehouse.value}
            poputTitle='选择库位'
            branchText='请选择仓库或直接扫码选择库位'
            textType='link'
            title={
              <LinkButton
                style={{ width: '100vw', fontSize, textAlign: 'left', color: !data.postionId && 'red' }}
                title='选择库位'
              />
            }
            value={data.postionId}
            api={storehousePositionsTreeView}
            onChange={(value) => {
              if (value && value !== data.postionId) {
                detailRun({
                  data: {
                    storehousePositionsId: value,
                  },
                });
                setData({ ...data, postionId: value });
              }
            }}
          />
        </List.Item>
      </List>
    </Card>

    <div style={{ padding: '16px 0 10vh 0' }}>
      {
        data.skus.length > 0 ? data.skus.map((item, index) => {
            return <div key={index} style={{ marginBottom: 16 }}>
              <Skus
                index={index}
                params={params.data[index]}
                sku={item}
                batchNumber={item.batchNumber}
                addCanvas={(res) => {
                  addCanvas(res);
                }}
                fontSize={fontSize}
                search={(res) => {
                  ref.current.search(res);
                }}
                onChange={(res) => {
                  const array = params.data;
                  array[index] = res;
                  setParams({ data: array });
                }}
              />
            </div>;
          })
          :
          <MyEmpty description='暂无物料' />
      }
    </div>


    <Search ref={ref} onChange={async (value) => {
      switch (value.type) {
        case 'storehouse':
          treeRef.current.run({
            params: {
              ids: value.value,
            },
          });
          setData({ ...data, storehouse: value });
          break;
        default:
          break;
      }
    }} />

    <AddSku
      data={data.skus}
      visible={visible}
      setVisible={(res) => {
        setVisible(res);
      }}
      onChange={(res) => {
        setData({ ...data, skus: [...data.skus, {
            skuId: res.value,
            skuResult: res.label,
            batch: res.batch,
            batchNumber:res.batchNumber,
          }] });
      }}
    />

    <div
      style={{
        textAlign: 'center',
      }}
    >
      <FloatingBubble
        style={{
          '--initial-position-bottom': '10vh',
          '--initial-position-right': '24px',
        }}
        onClick={() => {
          if (data.skus.length > 0) {
            setVisible(true);
          } else {

            if (!data.postionId) {
              return Toast.show({
                content: '请选择库位！',
                position: 'bottom',
              });
            }

            Dialog.alert({
              content: '当前库位下没有物料，请绑定物料！',
              closeOnAction: true,
              onAction: (action) => {
                if (action.key === 'ok') {

                } else {

                }
              },
              actions: [
                [
                  {
                    key: 'ok',
                    text: '是',
                  },
                  {
                    key: 'no',
                    text: '否',
                  },
                ],
              ],
            });

          }
        }}
      >
        <AddOutline fontSize={32} />
      </FloatingBubble>
    </div>

    <BottomButton
      only={state}
      disabled
      text='已入库'
      leftText='批量打印'
      leftDisabled={data.skus.length === 0 || getSkuData('skus').length === 0 || (getSkuData('inkind').length === 0 && getSkuData('skuItems').length === 0)}
      leftOnClick={async () => {
        printAllCode();
      }}
      rightDisabled={data.skus.length === 0 || getSkuData('errorNumber') || getSkuData('skus').length === 0 || getSkuData('brandOrCustomer')}
      rightOnClick={async () => {

        const inkindIds = await printAllCode();

        if (inkindIds.length > 0){
          instockRun({
            data: {
              positionsId: data.postionId,
              inkindIds: inkindIds,
              storeHouseId: data.storehouse.value,
            },
          });
        }else {
          Toast.show({
            content:'请选择实物！'
          });
        }

      }}
      rightText='入库'
    />

    {
      (loading || instockLoading || detailLoading || CodeLoading) && <MyLoading />
    }

  </>;
};

export default connect(({ qrCode }) => ({ qrCode }))(FreeInstock);
