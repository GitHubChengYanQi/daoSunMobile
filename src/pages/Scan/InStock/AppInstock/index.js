import React, { useState } from 'react';
import { connect } from 'dva';
import { Card, Dialog, List, Space, Toast } from 'antd-mobile';
import MyEmpty from '../../../components/MyEmpty';
import LinkButton from '../../../components/LinkButton';
import { request, useRequest } from '../../../../util/Request';
import { storehousePositionsTreeView } from '../../Url';
import CodeBind from '../../CodeBind';
import MyNavBar from '../../../components/MyNavBar';
import { MyLoading } from '../../../components/MyLoading';
import { ClearOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { useDebounceEffect } from 'ahooks';
import pares from 'html-react-parser';
import MyCascader from '../../../components/MyCascader';
import BackSkus from '../../Sku/components/BackSkus';
import Number from '../../../components/Number';
import PrintCode from '../../../components/PrintCode';

const fontSize = 24;

const AppInstock = (props) => {

  const [canvas, setCanvas] = useState([]);

  // 显示绑定操作
  const [itemBind, setItemBind] = useState(false);

  // 全局状态
  const qrCode = props.qrCode;
  console.log(qrCode);
// 当前扫描的二维码id
  const codeId = props.qrCode && props.qrCode.codeId;
// 路由传参
  const state = props.location.state;
// 当前物料信息
  const items = state && state.items;
// 当前入库单信息
  const data = state && state.data;
  // 是否是批量入库
  const batch = state && state.batch;

  // 入库数量
  const [number, setNumber] = useState(batch ? items.number : 1);

  // 自动批量入库
  const [autoBatch, setAutoBatch] = useState(false);

  // 管理全局状态
  const scanCodeState = (payload) => {
    props.dispatch({
      type: 'qrCode/scanCodeState',
      payload,
    });
  };
  const clearCode = () => {
    props.dispatch({
      type: 'qrCode/clearCode',
    });
  };

  // 待入库的二维码id
  const [waitCodeIds, setWaitCodeIds] = useState([]);
  // 待入库的数量
  const [waitNumber, setWaitNumber] = useState(0);

  // 是否全部完成扫码绑定
  const [complete, setComplete] = useState(false);

  // 库位
  const [storehousePositionsId, setStorehousePositionsId] = useState();

  // 自动绑定
  const { loading: autoLoading, run: autoBind } = useRequest(
    {
      url: '/orCode/automaticBinding',
      method: 'POST',
    },
    {
      manual: true,
      onSuccess: async (res) => {
        const templete = await request({
          url: '/inkind/detail',
          method: 'POST',
          data: {
            inkindId: res.inkindId,
          },
        });
        setCanvas([...canvas, {
          templete: templete.printTemplateResult && templete.printTemplateResult.templete,
          codeId: res.codeId,
        }]);
        if (templete.printTemplateResult && templete.printTemplateResult.templete) {
          PrintCode.print([templete.printTemplateResult && templete.printTemplateResult.templete], 0);
        }

        if (storehousePositionsId) {
          instockAction(res.codeId);
        } else {
          const complent = waitNumber + number;
          setWaitCodeIds([...waitCodeIds, res.codeId]);
          setWaitNumber(complent);
          setComplete((items.number - complent) === 0);
          batch && setNumber(complent);
        }
      },
    },
  );

  const instockSuccess = (number) => {
    items.number = items.number - number;
    batch ? setNumber(items.number) : setNumber(1);
    clearCode();
    Toast.show({
      content: '入库成功！',
    });
  };

  const { loading: instockLoading, run: instock } = useRequest({
    url: '/orCode/instockByCode',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: () => {
      instockSuccess(number);
    },
    onError: () => {
      clearCode();
    },
  });

  const { loading: batchInstockLoading, run: batchinstock } = useRequest({
    url: '/orCode/batchInstockByCode',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: () => {
      instockSuccess(waitNumber);
      setWaitCodeIds([]);
      setWaitNumber(0);
      clearCode();
    },
    onError: () => {
      setWaitCodeIds([]);
      setWaitNumber(0);
      clearCode();
    },
  });

  const { loading, run: codeRun } = useRequest({
    url: '/orCode/backObject',
    method: 'GET',
  }, {
    manual: true,
    onSuccess: (res) => {
      if (items.number <= 0) {
        Toast.show({
          content: '已经全部入库！，不可进行扫码操作！',
          position: 'bottom',
        });
        clearCode();
      } else {
        action(res);
      }
    },
  });

  const waitCodeInstock = () => {
    if (waitCodeIds.length > 0) {
      // 入库操作
      batchinstock({
        data: {
          type: 'item',
          codeIds: waitCodeIds,
          Id: items.skuId,
          instockListParam: {
            ...items,
            storehousePositionsId: storehousePositionsId,
          },
        },
      });
    }
  };

  const action = (res) => {
    // 判断二维码类型
    switch (res && res.type) {
      case 'storehousePositions':
        // 库位
        // 判断库位是否已经存在
        if (storehousePositionsId) {
          Toast.show({
            content: '已扫描库位！',
            position: 'bottom',
          });
        } else {
          if (res.result && res.result.storehouseId) {
            if (res.result.storehouseId === data.storeHouseId) {
              setStorehousePositionsId(res.result.storehousePositionsId);
              waitCodeInstock();
            } else {
              Toast.show({
                content: `请扫[ ${data.storehouseResult && data.storehouseResult.name} ] 的码！`,
                icon: 'fail',
                position: 'bottom',
              });
            }
          }
        }
        clearCode();
        break;
      default:
        props.dispatch({
          type: 'qrCode/scanInstock',
          payload: {
            codeId,
            items: {
              Id: items.skuId,
              type: 'item',
              ...items,
            },
            batch: false,
          },
        });
        break;
    }
  };

  const instockAction = (codeId) => {
    console.log(JSON.stringify(
      {
        type: 'item',
        codeId,
        Id: items.skuId,
        instockListParam: {
          ...items,
          codeId: qrCode.codeId,
          storehousePositionsId: storehousePositionsId,
        },
      },
    ));
    instock({
      data: {
        type: 'item',
        codeId,
        Id: items.skuId,
        instockListParam: {
          ...items,
          codeId: qrCode.codeId,
          storehousePositionsId: storehousePositionsId,
        },
      },
    });
  };

  const auto = () => {
    autoBind({
      data: {
        source: 'item',
        brandId: items.brandId,
        id: items.skuId,
        number,
        inkindType: '入库',
        sourceId: items.instockListId,
      },
    });
  };

  const getSkuResult = () => {
    return <BackSkus record={items} />;
  };


  useDebounceEffect(() => {
    if (qrCode.instockAction) {
      if (storehousePositionsId) {
        setNumber(qrCode.instockAction.number);
        instockAction(codeId);
      } else {
        const array = waitCodeIds.filter((value) => {
          return value === codeId;
        });
        if (array.length > 0) {
          Toast.show({
            content: '此物料已等待入库！',
            position: 'bottom',
          });
        } else {
          const completeNumber = waitNumber + qrCode.instockAction.number;
          if (completeNumber > items.number) {
            Toast.show({
              content: '不能大于入库数量！',
              position: 'bottom',
            });
          } else {
            setWaitCodeIds([...array, codeId]);
            setComplete((items.number - completeNumber) === 0);
            setWaitNumber(completeNumber);
          }
        }
        clearCode();
      }
      scanCodeState({
        instockAction: null,
      });
    }
  }, [qrCode.instockAction], {
    wait: 0,
  });

  useDebounceEffect(() => {
    if (codeId) {
      codeRun({
        params: {
          id: codeId,
        },
      });
    }
  }, [codeId], {
    wait: 0,
  });

  if (autoLoading || loading || instockLoading || batchInstockLoading) {
    return <MyLoading
      title={instockLoading || batchInstockLoading ? '入库中...' : '处理中...'} />;
  }

  if (!(items || data)) {
    return <MyEmpty />;
  }

  return (<>
    <MyNavBar title={batch ? '批量入库' : '扫码入库'} />
    <Card title='入库信息' />
    <List>
      <List.Item title='仓库'>
        <span style={{ fontSize, fontWeight: 900 }}>{data.storehouseResult && data.storehouseResult.name}</span>
      </List.Item>
      <List.Item title='物料'>
          <span style={{ fontSize }}>
          {getSkuResult()}
          </span>
      </List.Item>
      <List.Item
        title='库位'
        extra={<LinkButton style={{ paddingRight: 8 }} title={<><ClearOutlined />清除</>} onClick={() => {
          setStorehousePositionsId(null);
        }} />}>
        <span style={{ fontSize }}>
           <MyCascader
             arrow={false}
             poputTitle='选择库位'
             title={<Typography.Link underline>点击选择或扫描库位</Typography.Link>}
             value={storehousePositionsId}
             textType='link'
             api={storehousePositionsTreeView}
             defaultParams={
               {
                 params: {
                   ids: data.storeHouseId,
                 },
               }
             }
             clear={() => {
               setStorehousePositionsId(null);
             }}
             onChange={(value) => {
               setStorehousePositionsId(value);
             }}
             onOk={() => {
               waitCodeInstock();
             }}
           />
        </span>
      </List.Item>

    </List>
    <Card
      title={'总数量(' + items.instockNumber + ')'}
      extra={
        <LinkButton
          disabled={(items.number - waitNumber) === 0}
          style={{ paddingRight: 8 }}
          onClick={() => {
            if (batch) {
              setNumber(items.number - waitNumber);
              setAutoBatch(true);
            } else
              auto();
          }}
          title={<><PlayCircleOutlined />生成二维码</>} />} />
    <List>
      <List.Item
        title='已入库数量'
        extra={<span style={{ fontSize, color: 'green' }}>{items.instockNumber - items.number}</span>} />
      <List.Item title='待入库数量' extra={<span style={{ fontSize, color: 'red' }}>{waitNumber}</span>} />
    </List>

    {canvas.length > 0 && <Card title='已绑定的二维码'>
      <List>
        {
          canvas.map((items, index) => {
            return <List.Item
              key={index}
              extra={<LinkButton title='打印' onClick={async () => {
                PrintCode.print([items.templete], 0);
              }} />}
            >
              {
                pares(items.templete, {
                  replace: domNode => {
                    if (domNode.name === 'p') {
                      domNode.attribs = {
                        style: 'padding:0;margin:0',
                      };
                      return domNode;
                    }
                  },
                })
              }
            </List.Item>;
          })
        }
      </List>
    </Card>}

    {/*------------------------------批量入库选择数量-------------------------*/}
    <Dialog
      visible={batch ? (qrCode.bind || autoBatch) : false}
      title={getSkuResult()}
      content={
        <div style={{ textAlign: 'center' }}>
          <Space align='center'>
            入库数量：
            <Number
              color={number > 0 && number <= (items.number - waitNumber) ? 'blue' : 'red'}
              width={100}
              value={number}
              onChange={(value) => {
                setNumber(value);
              }} />
          </Space>
        </div>
      }
      onAction={async (action) => {
        if (action.key === 'next') {
          if (number > 0 && number <= (items.number - waitNumber)) {
            if (autoBatch) {
              auto();
            } else {
              setItemBind(true);
            }
            setAutoBatch(false);
            scanCodeState({
              bind: false,
            });
          } else {
            Toast.show({
              content: '请填入正确的数量!',
              position: 'bottom',
            });
          }

        } else {
          scanCodeState({
            bind: false,
          });
          setItemBind(false);
          setAutoBatch(false);
          setNumber(items.number - waitNumber);
          clearCode();
        }
      }}
      actions={[
        [{
          key: 'next',
          text: '下一步',
        },
          {
            key: 'close',
            text: '取消',
          }],
      ]}
    />

    {/*绑定二维码*/}
    {items && codeId && <CodeBind
      complete={complete}
      visible={batch ? itemBind : qrCode.bind}
      title={`[  ${items.spuResult && items.spuResult.spuClassificationResult && items.spuResult.spuClassificationResult.name} / ${items.spuResult && items.spuResult.name}     × ${number}  ]  是否绑定此二维码？`}
      data={{
        codeId: codeId,
        source: 'item',
        brandId: items.brandId,
        id: items.skuId,
        number,
        inkindType: '入库',
      }}
      onSuccess={() => {
        const completeNumber = waitNumber + number;
        if (storehousePositionsId) {
          instockAction(codeId);
        } else {
          setWaitCodeIds([...waitCodeIds, codeId]);
          setWaitNumber(completeNumber);
          batch && setNumber(items.number - completeNumber);
          clearCode();
        }
        setComplete((items.number - completeNumber) === 0);
        setItemBind(false);
        scanCodeState({
          bind: false,
        });
      }}
      onError={() => {
        setItemBind(false);
        batch && setNumber(items.number);
        scanCodeState({
          bind: false,
        });
        clearCode();
      }}
      onClose={() => {
        setItemBind(false);
        batch && setNumber(items.number);
        scanCodeState({
          bind: false,
        });
        clearCode();
      }}
    />}
  </>);
};

export default connect(({ qrCode }) => ({ qrCode }))(AppInstock);
