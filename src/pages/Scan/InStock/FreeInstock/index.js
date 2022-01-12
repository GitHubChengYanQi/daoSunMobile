import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, List, Space, Toast } from 'antd-mobile';
import { Typography } from 'antd';
import Search from './components/Search';
import { storehousePositionsTreeView } from '../../Url';
import { request, useRequest } from '../../../../util/Request';
import { connect } from 'dva';
import { MyLoading } from '../../../components/MyLoading';
import LinkButton from '../../../components/LinkButton';
import { AddOutline, DeleteOutline } from 'antd-mobile-icons';
import { useDebounceEffect, useSetState } from 'ahooks';
import Html2Canvas from '../../../Html2Canvas';
import { ScanOutlined } from '@ant-design/icons';
import { getHeader } from '../../../components/GetHeader';
import BottomButton from '../../../components/BottomButton';
import { NumberInput } from 'weui-react-v2';
import MyCascader from '../../../components/MyCascader';
import IsDev from '../../../../components/IsDev';
import style from './index.css';
import pares from 'html-react-parser';
import PrintCode from '../../../components/PrintCode';

const FreeInstock = (props) => {


  const ref = useRef();
  const treeRef = useRef();

  const codeId = props.qrCode && props.qrCode.codeId;

  const clearCode = () => {
    props.dispatch({
      type: 'qrCode/clearCode',
    });
  };

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
              storehousepostionId: res.result.storehousePositionsId,
            });
          }
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

  const [items, setItmes] = useSetState({
    data: [{
      number: 1,
    }],
  });


  const addCanvas = async (inkindIds) => {
    if (!getHeader()) {
      const templete = await request({
        url: '/inkind/details',
        method: 'POST',
        data: {
          inkindIds,
        },
      });
      PrintCode.print(templete && templete.map((items) => {
        return items.printTemplateResult && items.printTemplateResult.templete;
      }), 0);
    }

  };

  const listItems = () => {
    const arrays = [];
    for (let i = 0; i < items.data.length; i++) {
      const item = items.data[i];
      arrays.push(<List.Item
        key={i}
        extra={
          <LinkButton title={item.inkindId ? '打印二维码' : '生成二维码'} onClick={async () => {
            const brandId = data.brand.value;
            const id = data.sku.value;
            if (brandId && id) {
              if (item.number > 0) {
                const res = await request({
                  url: '/orCode/automaticBinding',
                  method: 'POST',
                  data: {
                    source: 'item',
                    brandId,
                    id,
                    number: item.number,
                    inkindType: '自由入库',
                  },
                });
                if (IsDev() || !getHeader()) {
                  addCanvas([res.inkindId]);
                }
                const arr = items.data;
                arr[i] = { ...arr[i], codeId: res.codeId, inkindId: res.inkindId };
                setItmes({ data: arr });
              } else {
                Toast.show({
                  content: '数量不能小于0!',
                  position: 'bottom',
                });
              }

            } else {
              Toast.show({
                content: '请先将物料和供应商信息填写完整!',
                position: 'bottom',
              });
            }

          }} />
        }
      >
        <Space align='center'>
          <LinkButton
            onClick={() => {
              items.data.splice(i, 1);
            }}
            disabled={item.inkindId || items.data.length === 1}
            title={
              <DeleteOutline />
            } />
          <div style={{ marginRight: 32 }}>
            第{i + 1}
            {
              data.sku.batch ? '批' : '个'
            }
          </div>
          {
            data.sku.batch && <NumberInput
              precision={0}
              className={item.inkindId ? style.black : (item.number > 0 ? style.blue : style.red)}
              type='amount'
              disabled={item.inkindId}
              style={{ width: 200, borderBottom: 'solid #eee 1px' }}
              prefix={<span style={{ color: '#000' }}>入库数量：</span>}
              value={item.number}
              onChange={(value) => {
                const arr = items.data;
                arr[i] = { ...arr[i], number: parseInt(value) };
                setItmes({ data: arr });
              }} />
          }
        </Space>
      </List.Item>);
    }
    return arrays;
  };

  const [data, setData] = useState({
    sku: {},
    brand: {},
    storehouse: {},
    storehousepostionId: null,
  });

  const clear = () => {
    setItmes({
      data: [{
        number: 1,
      }],
    });
    setData({
      sku: {},
      brand: {},
      storehouse: {},
      storehousepostionId: null,
    });
  };

  const { loading: instockLoading, run: instockRun } = useRequest({
    url: '/instockOrder/freeInstock',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: () => {
      clear();
      Toast.show({
        content: '入库成功！',
        position: 'bottom',
      });
    },
    onError: () => {
      clear();
      Toast.show({
        content: '入库失败！',
        position: 'bottom',
      });
    },
  });

  if (loading || instockLoading) {
    return <MyLoading
      loading={instockLoading || loading}
      title={instockLoading ? '入库中...' : '扫描中...'} />;
  }

  return <>
    <Card title='物料信息'>
      <List
        style={{
          '--border-top': 'none',
          '--border-bottom': 'none',
        }}
      >
        <List.Item title='物料'>
          <Typography.Link underline onClick={() => {
            ref.current.search({ type: 'sku' });
          }}>
            <div style={{ width: '100vw' }}>
              {
                data.sku.label || '请选择物料'
              }
            </div>
          </Typography.Link>
        </List.Item>
        <List.Item title='供应商(品牌)'>
          <Typography.Link underline onClick={() => {
            ref.current.search({ type: 'brand' });
          }}>
            <div style={{ width: '100vw' }}>
              {
                data.brand.label || '请选择供应商(品牌)'
              }
            </div>
          </Typography.Link>
        </List.Item>
        <List.Item title='仓库'>
          <Typography.Link underline onClick={() => {
            ref.current.search({ type: 'storehouse' });
          }}>
            <div style={{ width: '100vw' }}>
              {
                data.storehouse.label || '请选择仓库'
              }
            </div>
          </Typography.Link>
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
            branch={!data.storehouse.value}
            poputTitle='选择库位'
            branchText='请选择仓库或直接扫码选择库位'
            textType='link'
            resh={data.storehouse.value}
            title={<Typography.Link underline>选择库位</Typography.Link>}
            value={data.storehousepostionId}
            api={storehousePositionsTreeView}
            onChange={(value) => {
              setData({ ...data, storehousepostionId: value });
            }}
          />
        </List.Item>
      </List>
    </Card>

    <div style={{ margin: '16px 0' }}>
      <Card title='分批入库'>
        <List
          style={{
            '--border-top': 'none',
            '--border-inner': 'none',
          }}
        >
          {listItems()}
          <Button color='default' style={{ width: '100%' }} onClick={() => {
            setItmes({
              data: [...items.data, {
                number: 1,
              }],
            });
          }}><AddOutline /></Button>
        </List>
      </Card>
    </div>

    <Search ref={ref} onChange={(value) => {
      switch (value.type) {
        case 'sku':
          setItmes({
            data: [{
              number: 1,
            }],
          });
          setData({ ...data, sku: value });
          break;
        case 'brand':
          setData({ ...data, brand: value });
          break;
        case 'storehouse':
          treeRef.current.run({
            params: {
              ids: value.value,
            },
          });
          setData({ ...data, storehouse: value, storehousepostionId: null });
          break;
        default:
          break;
      }
    }} />

    <BottomButton
      leftText='批量打印'
      leftOnClick={async () => {
        const brandId = data.brand.value;
        const id = data.sku.value;
        if (brandId && id) {
          const numbers = items.data.filter((item) => {
            return item.number < 1;
          });

          const binds = [];

          items.data.map((items, index) => {
            if (!items.codeId) {
              binds.push({ number: items.number || 1, index });
            }
            return null;
          });

          const codeRequests = binds.map((items) => {
            return {
              source: 'item',
              brandId,
              id,
              number: items.number || 1,
              inkindType: '自由入库',
            };
          });
          if (numbers.length === 0) {
            let res = null;
            if (binds.length > 0) {
              res = await request({
                url: '/orCode/batchAutomaticBinding',
                method: 'POST',
                data: {
                  codeRequests,
                },
              });
            }
            const codeIds = res && res.map((items) => {
              return items.codeId;
            });
            const inkindIds = res && res.map((items) => {
              return items.inkindId;
            });
            const array = items.data;
            binds.map((items, index) => {
              return array[items.index] = {
                codeId: codeIds[index],
                number: items.number || 1,
                inkindId: inkindIds[index],
              };
            });
            const printInkinds = array.map((items) => {
              return items.inkindId;
            });
            addCanvas(printInkinds);
            setItmes({ data: array });
          } else {
            Toast.show({
              content: '数量不能小于0!',
              position: 'bottom',
            });
          }

        } else {
          Toast.show({
            content: '请先将物料和供应商信息填写完整!',
            position: 'bottom',
          });
        }
      }}
      rightDisabled={
        !data.storehousepostionId
        ||
        !data.storehouse.value
        ||
        items.data.filter((value) => {
          return !value.codeId;
        }).length > 0
      }
      rightOnClick={() => {
        if (items.data.filter((value) => {
          return value.number <= 0;
        }).length === 0) {
          instockRun({
            data: {
              positionsId: data.storehousepostionId,
              codeIds: items.data.map((items) => {
                return items.codeId;
              }),
              storeHouseId: data.storehouse.value,
            },
          });
        } else {
          Toast.show({
            content: '数量不能小于1个!',
            position: 'bottom',
          });
        }
      }}
      rightText='入库'
    />
  </>;
};

export default connect(({ qrCode }) => ({ qrCode }))(FreeInstock);
