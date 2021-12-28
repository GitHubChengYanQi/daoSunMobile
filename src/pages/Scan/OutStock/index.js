import { Button, Collapse, Dialog, Empty, List, Space, Stepper, Toast } from 'antd-mobile';
import { Col, Row } from 'antd';
import { DownOutlined, LeftOutlined, ScanOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { storehousePositionsTreeView } from '../Url';
import { request, useRequest } from '../../../util/Request';
import TreeSelectSee from '../../components/TreeSelectSee';
import { WhiteSpace } from 'weui-react-v2';
import { useDebounceEffect } from 'ahooks';
import MyEmpty from '../../components/MyEmpty';
import { MyLoading } from '../../components/MyLoading';
import { getHeader } from '../../components/GetHeader';
import { connect } from 'dva';
import { history } from 'umi';
import IsDev from '../../../components/IsDev';

const OutStock = (props) => {

  const id = props.location.query.id;

  const qrCode = props.qrCode;

  const outstockAction = qrCode.outstockAction;

  // 控制全局状态
  const scanCodeState = (payload) => {
    props.dispatch({
      type: 'qrCode/scanCodeState',
      payload,
    });
  };

  const [data, setData] = useState();

  const { loading, run, refresh } = useRequest({
    url: '/orCode/backObject',
    method: 'GET',
  }, {
    manual: true,
    onSuccess: (res) => {
      setData(res.result);
    },
  });

  const [number, setNumber] = useState(1);

  const [itemNumber, setItemNumber] = useState(1);

  const [items, setItems] = useState();

  const [stockDetails, setStockDetails] = useState();

  const { data: storehouseposition } = useRequest(storehousePositionsTreeView);


  const next = (items) => {
    Dialog.show({
      content: `出库成功！是否继续出库 [ ${items.sku && items.sku.skuName} / ${items.spuResult && items.spuResult.name} ]？`,
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
              action: 'scanOutstock',
              data,
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

  const getSkuResult = (items, br) => {
    if (!items)
      return null;
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

  const outstockContent = (items) => {
    const stockNumber = outstockAction && outstockAction.stockDetails && outstockAction.stockDetails.number;
    const maxNumber = stockNumber < itemNumber ? stockNumber : itemNumber;

    return <>
      {getSkuResult(items)}
      <WhiteSpace size='sm' />
      {items && items.brandResult && items.brandResult.brandName}
      <WhiteSpace size='sm' />
      库位：{data && data.storehouseResult && data.storehouseResult.name} - {outstockAction && outstockAction.positions && outstockAction.positions.name}
      <WhiteSpace size='sm' />
      库存数量:&nbsp;&nbsp;×{stockNumber}
      <WhiteSpace size='sm' />
      {stockNumber > 1 && <Space>
        <div>
          出库数量：
        </div>
        <Stepper
          min={1}
          max={maxNumber}
          value={number}
          onChange={value => {
            setNumber(value);
          }}
        />
      </Space>}
    </>;
  };

  if (loading)
    return <MyLoading />;

  if (!data)
    return <MyEmpty height='100vh' />;

  return (
    <>
      <Collapse defaultActiveKey={['0', '1', '2']}>
        <Collapse.Panel key='0' title='出库信息'>
          <List.Item>出库单号：{data.coding}</List.Item>
          <List.Item>仓库名称：{data.storehouseResult && data.storehouseResult.name}</List.Item>
          <List.Item>负责人：{data.userResult && data.userResult.name}</List.Item>
          <List.Item>备注：{data.note || '无'}</List.Item>
          <List.Item>创建时间：{data.createTime}</List.Item>
        </Collapse.Panel>
        <Collapse.Panel key='1' title='出库清单'>
          <>
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
            {data.outstockListing && data.outstockListing.length > 0 ?
              data.outstockListing.map((items, index) => {
                if (items.number > 0) {
                  return <List.Item key={index}>
                    <Row gutter={24} justify='space-around' align='middle'>
                      <Col span={16}>
                        {getSkuResult(items)}
                      </Col>
                      <Col span={8} style={{ textAlign: 'center' }}>
                        <Space>
                          <Button
                            color='primary'
                            fill='none'
                            style={{ padding: 0 }}
                            onClick={async () => {
                              if (!IsDev() && getHeader()) {
                                setItems(items);
                                setItemNumber(items.number);
                                //调用扫码
                                // scan(items);
                                await props.dispatch({
                                  type: 'qrCode/wxCpScan',
                                  payload: {
                                    items: {
                                      Id: items.skuId,
                                      type: 'item',
                                      ...items,
                                    },
                                    action: 'scanOutstock',
                                    data,
                                  },
                                });
                              }else {
                                history.push({
                                  pathname: '/Scan/OutStock/AppOutstock',
                                  state: {
                                    items,
                                    data,
                                  },
                                });
                              }
                            }}
                          ><ScanOutlined />扫码出库</Button>
                        </Space>
                      </Col>
                    </Row>

                    <Row gutter={24} justify='space-around' align='middle'>
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
                              const details = await request({
                                url: '/stockDetails/list',
                                method: 'POST',
                                data: {
                                  skuId: items.skuId,
                                  storehouseId: data && data.storehouseId,
                                  brandId: items.brandId,
                                },
                              });
                              if (stockDetails && stockDetails.index && stockDetails.index === `${index}`) {
                                setStockDetails(false);
                              } else {
                                setStockDetails({ index: `${index}`, stockDetails: details });
                              }


                            }}
                          >{stockDetails && stockDetails.index && stockDetails.index === `${index}` ? <>
                            <DownOutlined />收起库位</> : <><LeftOutlined />查看库位</>}</Button>
                        </Space>
                      </Col>
                    </Row>
                    {stockDetails && stockDetails.index && stockDetails.index === `${index}` && <>
                      {
                        stockDetails.stockDetails && stockDetails.stockDetails.map((items, index) => {
                          return <div key={index}>
                            {data.storehouseResult && data.storehouseResult.name} -
                            <TreeSelectSee data={storehouseposition} value={items.storehousePositionsId} />
                            &nbsp;&nbsp;× {items.number}
                          </div>;
                        })
                      }

                    </>}

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
          </>
        </Collapse.Panel>
        <Collapse.Panel key='2' title='出库明细'>
          <>
            {data.outstockResults && data.outstockResults.length > 0 ?
              data.outstockResults.map((items, index) => {
                return <List.Item key={index}>
                  <Row gutter={24}>
                    <Col span={6}>
                      <strong>编号:</strong>
                      {items.stockItemId}
                    </Col>
                    <Col span={18}>
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
                  </Row>

                  <Row gutter={24}>
                    <Col span={12}>
                      <strong>品牌(供应商):</strong>{items.brandResult && items.brandResult.brandName}
                    </Col>
                    <Col span={4}>
                      ×
                      {items.number}
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
          </>
        </Collapse.Panel>
      </Collapse>

      {/*------------------------------出库弹窗-------------------------*/}
      {outstockAction && items && <Dialog
        visible={outstockAction}
        content={outstockContent(items)}
        onAction={async (action) => {
          setNumber(1);
          if (action.key === 'out') {
            await request({
              url: '/orCode/outStockByCode',
              method: 'POST',
              data: {
                number,
                outstockOrderId: data && data.outstockOrderId,
                storehouse: data && data.storehouseId,
                codeId: qrCode.codeId,
                outstockListingId: items.outstockListingId,
              },
            }).then((res) => {
              if (res > 0) {
                setItemNumber(res);
                next(items);
                scanCodeState({
                  outstockAction: null,
                });
              } else if (res === 0) {
                Toast.show({
                  content: '全部出库成功！',
                  position: 'bottom',
                });
                scanCodeState({
                  outstockAction: null,
                });
              }
              refresh();
            });
          } else {
            scanCodeState({
              outstockAction: null,
            });
          }
        }}
        actions={[
          [{
            key: 'out',
            text: '出库',
          },
            {
              key: 'close',
              text: '取消',
            }],
        ]}
      />}
    </>
  );
};
export default connect(({ qrCode }) => ({ qrCode }))(OutStock);

