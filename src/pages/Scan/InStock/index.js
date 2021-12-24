import { Button, Collapse, Dialog, Empty, List, Space, Stepper, Toast } from 'antd-mobile';
import { Col, Row } from 'antd';
import { BarsOutlined, ScanOutlined } from '@ant-design/icons';
import React, { useEffect,  useState } from 'react';
import MyTreeSelect from '../../components/MyTreeSelect';
import { storehousePositionsTreeView } from '../Url';
import { request, useRequest } from '../../../util/Request';
import { useBoolean } from 'ahooks';
import TreeSelectSee from '../../components/TreeSelectSee';
import { WhiteSpace } from 'weui-react-v2';
import MyEmpty from '../../components/MyEmpty';
import MyDialog from '../../components/MyDialog';
import { connect } from 'dva';


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

  useEffect(() => {
    if (id) {
      run({
        params: {
          id,
        },
      });
    }

  }, [id, run]);


  const [stroeHousePostion, setStroeHousePostion] = useState();

  const [batch, setBatch] = useState(false);

  const [items, setItems] = useState();

  const [number, setNumber] = useState(1);

  const [instockNumber, setInstockNumber] = useState(0);

  const [show, { setTrue, setFalse }] = useBoolean();


  const { loading: storehousepostionLoading, data: storehouseposition } = useRequest(storehousePositionsTreeView);


  const scanStorehousePositon = () => {
    return <Button
      color='primary'
      fill='none'
      style={{ padding: 0 }}
      onClick={() => {
        setTrue();
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
    return <MyDialog visible={true} />;

  if (!data)
    return <MyEmpty />;


  return (
    <>
      <Collapse defaultActiveKey={['0', '1', '2']}>
        <Collapse.Panel key='0' title='入库信息'>
          <div>
            <List.Item>入库单号：{data.coding}</List.Item>
            <List.Item>仓库名称：{data.storehouseResult && data.storehouseResult.name}</List.Item>
            <List.Item>负责人：{data.userResult && data.userResult.name}</List.Item>
            <List.Item>入库类别：{data.type || '手动添加'}</List.Item>
            <List.Item>创建时间：{data.createTime}</List.Item>
          </div>
        </Collapse.Panel>

        <Collapse.Panel key='1' title='入库清单'>
          <List.Item>
            <Row gutter={24}>
              <Col span={16} style={{ textAlign: 'center' }}>
                物料信息
              </Col>
              <Col span={8} style={{ textAlign: 'center' }}>
                操作
              </Col>
            </Row>
          </List.Item>
          {data.instockListResults && data.instockListResults.length > 0 ?
            data.instockListResults.map((items, index) => {
              if (items.number > 0) {
                return <List.Item key={index}>
                  <Row gutter={24}>
                    <Col span={16}>
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
                    </Col>
                    <Col span={8} style={{ textAlign: 'center' }}>
                      <Space>
                        <Button
                          color='primary'
                          fill='none'
                          style={{ padding: 0 }}
                          onClick={async () => {
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
                          }}
                        ><ScanOutlined />扫码入库</Button>
                      </Space>
                    </Col>
                  </Row>
                  <WhiteSpace size='sm' />
                  <Row gutter={24}>
                    <Col span={16}>
                      {items.brandResult && items.brandResult.brandName}
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      ×
                      {items.number}
                    </Col>
                    <Col span={8} style={{ textAlign: 'center' }}>
                      <Space>
                        <Button
                          color='primary'
                          fill='none'
                          style={{ padding: 0 }}
                          onClick={async () => {
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
                          }}
                        ><BarsOutlined />批量入库</Button>
                      </Space>
                    </Col>
                  </Row>
                </List.Item>;
              } else {
                return null;
              }
            })
            :
            <Empty
              style={{ padding: '64px 0' }}
              imageStyle={{ width: 128 }}
              description='暂无数据'
            />}
        </Collapse.Panel>

        <Collapse.Panel key='2' title='入库明细'>
          {storehousepostionLoading ?
            <MyEmpty />
            :
            <>
              {data.instockResults && data.instockResults.length > 0 ?
                data.instockResults.map((items, index) => {
                  return <List.Item key={index}>
                    <Row gutter={24}>
                      <Col span={20}>
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
                      </Col>
                      <Col span={4}>
                        ×
                        {items.number}
                      </Col>
                    </Row>

                    <Row gutter={24}>
                      <Col span={12}>
                        <strong>品牌(供应商):</strong>{items.brandResult && items.brandResult.brandName}
                      </Col>
                      <Col span={12}>
                        <strong>仓库库位：</strong>
                        {items.storehousePositions
                          ?
                          <TreeSelectSee data={storehouseposition} value={items.storehousePositionsId} />
                          :
                          (items.storehouseResult && items.storehouseResult.name)}
                      </Col>
                    </Row>
                  </List.Item>;
                })
                :
                <Empty
                  style={{ padding: '64px 0' }}
                  imageStyle={{ width: 128 }}
                  description='暂无数据'
                />}
            </>}
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
                show={show}
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
                  setFalse();
                }}
                // onOk={() => {
                //   setFalse();
                // }}
                // clear={() => {
                //   setFalse();
                // }}
              />

              {scanStorehousePositon()}
            </Space>
          </div>
        }
        onClose={() => {
          setFalse();
          props.dispatch({
            type: 'qrCode/scanCodeState',
            payload: {
              instockAction: false,
            },
          });
        }}
        onAction={async (action) => {
          if (action.key === 'instock') {
            if (stroeHousePostion || qrCode.stroeHousePostion) {
              await request({
                url: '/orCode/instockByCode', method: 'POST', data: {
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
                setFalse();
                await props.dispatch({
                  type: 'qrCode/scanCodeState',
                  payload: {
                    instockAction: false,
                  },
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
              setTrue();
            }
            //如果入库成功
          } else {
            props.dispatch({
              type: 'qrCode/scanCodeState',
              payload: {
                instockAction: false,
              },
            });
            setFalse();
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
                bind:true,
              })
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
      <Dialog
        visible={items && qrCode.codeId && qrCode.bind}
        content={items && `“ ${items.sku && items.sku.skuName} \\ ${items.spuResult && items.spuResult.name} ”是否绑定此二维码？`}
        onAction={async (action) => {
          if (action.key === 'ok') {
            await request({
              url: '/orCode/backCode',
              method: 'POST',
              data: {
                codeId: qrCode.codeId,
                source: 'item',
                ...items,
                id: items.skuId,
                number: number,
                inkindType: '入库',
              },
            }).then((res) => {
              if (typeof res === 'string') {
                scanCodeState({
                  bind: false,
                  instockAction: true,
                });
                Toast.show({
                  content: '绑定成功！',
                  position: 'bottom',
                });
              }else {
                scanCodeState({
                  bind: false,
                });
              }
            })
          } else {
            scanCodeState({
              bind: false,
            });
          }
        }}
        actions={[
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
        ]}
      />

    </>
  );
};
export default connect(({ qrCode }) => ({ qrCode }))(InStock);
