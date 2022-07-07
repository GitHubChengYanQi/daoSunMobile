import React, { useEffect, useRef, useState } from 'react';
import { Card, Dialog, FloatingBubble, List, Toast } from 'antd-mobile';
import Search from './components/Search';
import { storehousePositionsTreeView } from '../../Url';
import { request, useRequest } from '../../../../util/Request';
import { MyLoading } from '../../../components/MyLoading';
import LinkButton from '../../../components/LinkButton';
import { useBoolean, useSetState } from 'ahooks';
import { ScanOutlined } from '@ant-design/icons';
import BottomButton from '../../../components/BottomButton';
import MyCascader from '../../../components/MyCascader';
import IsDev from '../../../../components/IsDev';
import PrintCode from '../../../components/PrintCode';
import { batchBind, storehousePositionsDetail } from '../components/Url';
import {SkuResultSkuJsons} from '../../Sku/components/SkuResult_skuJsons';
import Skus from './components/Skus';
import AddSku from './components/AddSku';
import { AddOutline } from 'antd-mobile-icons';
import MyEmpty from '../../../components/MyEmpty';
import { ToolUtil } from '../../../components/ToolUtil';

const fontSize = 18;

const PositionFreeInstock = ({ scanData, ...props }) => {

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
          return !item.inkindId && item.number;
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
      // case 'brandOrCustomer':
      //   // 品牌或者供应商是否有问题
      //   return skus.filter((item) => {
      //     return !item.brandId || !item.customerId;
      //   }).length > 0;
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
    if (scanData) {
      if (scanData && scanData.storehouseResult) {
        setData({
          ...data,
          storehouse: {
            label: scanData.storehouseResult.name,
            value: scanData.storehouseResult.storehouseId,
          },
          postionId: scanData.storehousePositionsId,
        });
      }
      detailRun({
        data: {
          storehousePositionsId: scanData.storehousePositionsId,
        },
      });
    }
  }, [scanData]);

  const ref = useRef();
  const treeRef = useRef();


  const [visible, setVisible] = useState();


  const { loading: detailLoading, run: detailRun } = useRequest(
    storehousePositionsDetail,
    {
      manual: true,
      onSuccess: (res) => {
        setData({
          ...data,
          postionId:res.storehousePositionsId,
          skus: res.skuResults.map((item) => {
            return {
              batch: item.batch === 1,
              skuId: item.skuId,
              skuResult: SkuResultSkuJsons({skuResult:item})
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


  const addCanvas = async (inkindIds) => {
    if (IsDev() || !ToolUtil.isQiyeWeixin()) {
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
        if (!value.inkindId && value.number) {
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
    return printCodes;
  };

  return <>
    <Card
      title='入库库位'
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
        <List.Item title='库位' extra={ToolUtil.isQiyeWeixin() && <LinkButton
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
            disabled={!data.storehouse.value}
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
              }
            }}
          />
        </List.Item>
      </List>
    </Card>

    <div style={{ padding: '16px 0 10vh 0' }}>
      <Card title='入库物料'>
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
      </Card>
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
        setData({
          ...data, skus: [...data.skus, {
            skuId: res.value,
            skuResult: res.label,
            batch: res.batch,
            batchNumber: res.batchNumber,
          }],
        });
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
        const inkindIds = await printAllCode();
        addCanvas(inkindIds);
      }}
      rightDisabled={data.skus.length === 0 || getSkuData('errorNumber') || getSkuData('skus').length === 0}
      rightOnClick={async () => {

        const inkindIds = await printAllCode();

        if (inkindIds.length > 0) {
          instockRun({
            data: {
              positionsId: data.postionId,
              inkindIds: inkindIds,
              storeHouseId: data.storehouse.value,
            },
          });
        } else {
          Toast.show({
            content: '请选择实物！',
          });
        }

      }}
      rightText='入库'
    />

    {
      (instockLoading || detailLoading || CodeLoading) && <MyLoading />
    }

  </>;
};

export default PositionFreeInstock;
