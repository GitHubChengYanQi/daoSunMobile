import { Button, Collapse, Dialog, Empty, List, Space, Stepper, Toast } from 'antd-mobile';
import { Col, Row } from 'antd';
import { BarsOutlined, ScanOutlined } from '@ant-design/icons';
import React, { useRef, useState } from 'react';
import MyTreeSelect from '../../components/MyTreeSelect';
import { storehousePositionsTreeView } from '../Url';
import { request, useRequest } from '../../../util/Request';
import TreeSelectSee from '../../components/TreeSelectSee';
import { WhiteSpace } from 'weui-react-v2';
import MyEmpty from '../../components/MyEmpty';
import { connect } from 'dva';
import { getHeader } from '../../components/GetHeader';
import { history } from 'umi';
import CodeBind from '../CodeBind';
import { MyLoading } from '../../components/MyLoading';
import { useDebounceEffect } from 'ahooks';
import IsDev from '../../../components/IsDev';


const InStock = (props) => {

  const id = props.location.query.id;

  const qrCode = props.qrCode;

  const [data, setData] = useState();

  const scanCodeState = (payload) => {
    props.dispatch({
      type: 'qrCode/scanCodeState',
      payload,
    });
  };

  const { loading, run, refresh } = useRequest({
    url: '/orCode/backObject',
    method: 'GET',
  }, {
    manual: true,
    onSuccess: (res) => {
      setData(res.result);
    },
  });

  useDebounceEffect(() => {
    if (id) {
      run({
        params: {
          id,
        },
      });
    }
  }, [id], {
    wait: 0,
  });


  const [stroeHousePostion, setStroeHousePostion] = useState();

  const [batch, setBatch] = useState(false);

  const [items, setItems] = useState();

  const [number, setNumber] = useState(1);

  const [instockNumber, setInstockNumber] = useState(0);

  const getSkuResult = (items, br) => {
    return <>
      {items.sku && items.sku.skuName}
      &nbsp;/&nbsp;
      {items.spuResult && items.spuResult.name}
      {br ? <br /> : <>&nbsp;&nbsp;</>}
      {
        items.backSkus
        &&
        items.backSkus.length > 0
        &&
        items.backSkus[0].attributeValues
        &&
        items.backSkus[0].attributeValues.attributeValues
        &&
        <em style={{ color: '#c9c8c8', fontSize: 12 }}>
          (
          {
            items.backSkus
            &&
            items.backSkus.map((items, index) => {
              return <span key={index}>
                        {items.itemAttribute.attribute}：{items.attributeValues.attributeValues}
                      </span>;
            })
          }
          )
        </em>
      }
    </>;
  };

  const showRef = useRef();


  const { loading: storehousepostionLoading, data: storehouseposition } = useRequest(storehousePositionsTreeView);


  const scanStorehousePositon = () => {
    return <Button
      color='primary'
      fill='none'
      style={{ padding: 0 }}
      onClick={() => {
        //扫描库位
        props.dispatch({
          type: 'qrCode/wxCpScan',
          payload: {
            action: 'scanStorehousePositon',
            data,
          },
        });

      }}
    ><ScanOutlined />扫描库位</Button>;
  };

  const next = (items) => {
    Dialog.show({
      content: `“ ${items.sku && items.sku.skuName} / ${items.spuResult && items.spuResult.name} “是否要继续${batch ? '批量入库' : '扫码入库'} ？`,
      closeOnMaskClick: true,
      closeOnAction: true,
      onAction: async (action) => {
        if (action.key === 'ok') {
          await props.dispatch({
            type: 'qrCode/wxCpScan',
            payload: {
              items: {
                Id: items.skuId,
                type: 'item',
                ...items,
              },
              batch: batch,
              action: 'scanInstock',
            },
          });
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
  };


  if (loading)
    return <MyLoading />;

  if (!data)
    return <MyEmpty />;


  return (
    <div style={{ margin: 16 }}>
      <Collapse defaultActiveKey={['0', '1', '2']}>
        <Collapse.Panel
          key='0'
          title={<strong
            style={{
              borderBottom: 'solid 1px #1845b5',
              padding: 8,
              margin: 8,
            }}>
            入库信息
          </strong>}
          style={{ backgroundColor: '#f4f4f4', paddingBottom: 8 }}>
          <List
            style={{
              '--border-inner': 'none',
              '--border-top': 'none',
              '--border-bottom': 'none',
            }}
          >
            <List.Item>入库单号：{data.coding}</List.Item>
            <List.Item>仓库名称：{data.storehouseResult && data.storehouseResult.name}</List.Item>
            <List.Item>负责人：{data.userResult && data.userResult.name}</List.Item>
            <List.Item>入库类别：{data.type || '手动添加'}</List.Item>
            <List.Item>创建时间：{data.createTime}</List.Item>
          </List>
        </Collapse.Panel>

        <Collapse.Panel
          key='1'
          title={<strong
            style={{
              borderBottom: 'solid 1px #1845b5',
              padding: 8,
              margin: 8,
            }}>入库清单</strong>}
          style={{ backgroundColor: '#f4f4f4', paddingBottom: 8 }}
        >
          {data.instockListResults
          &&
          data.instockListResults.length > 0
          &&
          data.instockListResults.filter((value) => {
            return value.number !== 0;
          }).length !== 0
            ?
            <List
              style={{
                '--border-top': 'none',
                '--border-bottom': 'none',
                '--border-inner': 'none',
              }}
            >
              {
                data.instockListResults.map((items, index) => {
                  const batch = items.sku.batch === 1;
                  if (items.number > 0) {
                    return <List.Item
                      key={index}
                      description={
                        <>
                          {
                            batch
                              ?
                              <Button
                                style={{ padding: 0, backgroundColor: '#1845b5' }}
                                onClick={async () => {
                                  if (IsDev() ? false : getHeader()) {
                                    await setBatch(true);
                                    await setItems(items);
                                    await setInstockNumber(items.number);
                                    await setNumber(items.number);
                                    await props.dispatch({
                                      type: 'qrCode/wxCpScan',
                                      payload: {
                                        items: {
                                          Id: items.skuId,
                                          type: 'item',
                                          ...items,
                                        },
                                        batch: true,
                                        action: 'scanInstock',
                                      },
                                    });
                                  } else {
                                    history.push({
                                      pathname: '/Scan/InStock/AppInstock',
                                      state: {
                                        items,
                                        data,
                                        batch: true,
                                      },
                                    });
                                  }
                                }}
                              ><BarsOutlined />批量入库</Button>
                              :
                              <Button
                                color='primary'
                                fill='none'
                                style={{
                                  width: '100%',
                                  marginTop: 8,
                                  border: 'none',
                                  borderBottom: '1px solid #1677ff',
                                }}
                                onClick={async () => {
                                  if (IsDev() ? false : getHeader()) {
                                    await setItems(items);
                                    await setBatch(false);
                                    await setInstockNumber(1);
                                    await setNumber(1);
                                    await props.dispatch({
                                      type: 'qrCode/wxCpScan',
                                      payload: {
                                        items: {
                                          Id: items.skuId,
                                          type: 'item',
                                          ...items,
                                        },
                                        batch: false,
                                        action: 'scanInstock',
                                      },
                                    });
                                  } else {
                                    history.push({
                                      pathname: '/Scan/InStock/AppInstock',
                                      state: {
                                        items,
                                        data,
                                        batch: false,
                                      },
                                    });
                                  }
                                }}
                              ><ScanOutlined />扫码入库</Button>
                          }
                        </>
                      }
                    >
                      {getSkuResult(items)}
                      <WhiteSpace size='sm' />
                      {items.brandResult && items.brandResult.brandName}
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      ×
                      {items.number}
                    </List.Item>;
                  } else {
                    return null;
                  }
                })
              }
            </List>
            :
            <MyEmpty description='已全部入库' />}
        </Collapse.Panel>

        <Collapse.Panel
          key='2'
          title={<strong
            style={{
              borderBottom: 'solid 1px #1845b5',
              padding: 8,
              margin: 8,
            }}>入库明细</strong>}
          style={{ backgroundColor: '#f4f4f4', paddingBottom: 8 }}>
          {storehousepostionLoading ?
            <MyEmpty />
            :
            <List
              style={{
                '--border-top': 'none',
                '--border-bottom': 'none',
                '--border-inner': '1px solid #1677ff',
              }}
            >
              {data.instockResults && data.instockResults.length > 0 ?
                data.instockResults.map((items, index) => {
                  return <List.Item
                    key={index}
                    extra={<Button style={{ '--border-radius': '10px', color: '#1845b5' }}>×
                      {items.number}</Button>}>
                    {getSkuResult(items)}
                    <br />
                    <strong>库位：</strong>
                    {items.storehousePositions
                      ?
                      <TreeSelectSee data={storehouseposition} value={items.storehousePositionsId} />
                      :
                      (items.storehouseResult && items.storehouseResult.name)}
                  </List.Item>;
                })
                :
                <Empty
                  style={{ padding: '64px 0' }}
                  imageStyle={{ width: 128 }}
                  description='暂无数据'
                />}
            </List>}

        </Collapse.Panel>
      </Collapse>

      {/*---------------------------------选择库位进行入库操作----------------------*/}
      <Dialog
        visible={qrCode && qrCode.instockAction}
        title={
          items && <>
            {items.sku && items.sku.skuName}
            &nbsp;/&nbsp;
            {items.spuResult && items.spuResult.name}
            &nbsp;&nbsp;
            <em style={{ color: '#c9c8c8', fontSize: 10 }}>
              (
              {
                items.backSkus
                &&
                items.backSkus.map((items, index) => {
                  return <span key={index}>
          {items.itemAttribute.attribute}：{items.attributeValues.attributeValues}
            </span>;
                })
              }
              )
            </em>
          </>}
        content={
          <div style={{ textAlign: 'center' }}>
            <Space direction='vertical'>
              <MyTreeSelect
                poputTitle={scanStorehousePositon()}
                title='选择库位'
                value={(qrCode.stroeHousePostion && qrCode.stroeHousePostion.storehousePositionsId) || stroeHousePostion}
                ref={showRef}
                api={storehousePositionsTreeView}
                defaultParams={
                  {
                    params: {
                      ids: data.storeHouseId,
                    },
                  }
                }
                onChange={(value) => {
                  setStroeHousePostion(value);
                }}
              />

              {scanStorehousePositon()}
            </Space>
          </div>
        }
        onClose={() => {
          scanCodeState({
            instockAction: null,
          });
        }}
        onAction={async (action) => {
          if (action.key === 'instock') {
            if (stroeHousePostion || qrCode.stroeHousePostion) {
              await request({
                url: '/orCode/instockByCode',
                method: 'POST',
                data: {
                  type: 'item',
                  codeId: qrCode.codeId,
                  Id: items.skuId,
                  instockListParam: {
                    ...items,
                    codeId: qrCode.codeId,
                    storehousePositionsId: (qrCode.stroeHousePostion && qrCode.stroeHousePostion.storehousePositionsId) || stroeHousePostion,
                  },
                },
              }).then(async (res) => {
                await refresh();
                await scanCodeState({
                  instockAction: null,
                });
                if (res !== 0) {
                  await setInstockNumber(res);
                  if (batch) {
                    await setNumber(res);
                  } else {
                    await setNumber(1);
                  }
                  next(items);
                } else {
                  Toast.show({
                    content: '已经全部入库！',
                    position: 'bottom',
                  });
                }
              });
            } else {
              showRef.current.show();
            }
            //如果入库成功
          } else {
            scanCodeState({
              instockAction: null,
            });
          }

        }}
        actions={[
          [{
            key: 'instock',
            text: '入库',
          },
            {
              key: 'close',
              text: '取消',
            }],
        ]}
      />

      {/*------------------------------批量入库选择数量-------------------------*/}
      <Dialog
        visible={items && qrCode.batchBind}
        title={
          items && <>
            {getSkuResult(items)}
          </>}
        content={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <div>
                入库数量：
              </div>
              <Stepper
                min={1}
                max={instockNumber}
                value={number}
                onChange={value => {
                  setNumber(value);
                }}
              />
            </Space>
          </div>
        }
        onClose={() => {
          scanCodeState({
            batchBind: false,
          });
        }}
        onAction={async (action) => {
          if (action.key === 'next') {
            if (number > instockNumber) {
              Toast.show({
                content: '不能超过未入库数量！',
                position: 'bottom',
              });
            } else {
              scanCodeState({
                bind: true,
              });
              scanCodeState({
                batchBind: false,
              });
            }
          } else {
            scanCodeState({
              batchBind: false,
            });
            setNumber(1);
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
      {items && <CodeBind
        visible={qrCode.codeId && qrCode.bind}
        title={`“ ${items.sku && items.sku.skuName} \\ ${items.spuResult && items.spuResult.name} ”是否绑定此二维码？`}
        data={{
          codeId: qrCode.codeId,
          source: 'item',
          ...items,
          id: items.skuId,
          number: number,
          inkindType: '入库',
        }}
        onSuccess={() => {
          scanCodeState({
            bind: false,
            instockAction: {},
          });
          Toast.show({
            content: '绑定成功！',
            position: 'bottom',
          });
        }}
        onError={() => {
          scanCodeState({
            bind: false,
          });
        }}
        onClose={() => {
          scanCodeState({
            bind: false,
          });
        }}
      />}
    </div>
  );
};
export default connect(({ qrCode }) => ({ qrCode }))(InStock);
