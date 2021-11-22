import { Button, Card,  Dialog, Empty, List, Space, Stepper, Toast } from 'antd-mobile';
import { Col, Row } from 'antd';
import { DownOutlined, LeftOutlined, ScanOutlined } from '@ant-design/icons';
import wx from 'populee-weixin-js-sdk';
import React, { useState } from 'react';
import { storehousePositionsTreeView } from '../Url';
import { request, useRequest } from '../../../util/Request';
import TreeSelectSee from '../../components/TreeSelectSee';
import { WhiteSpace } from 'weui-react-v2';

const testCodeId = '1460124130929065985';

const OutStock = ({ data, onChange }) => {

  const [visible, setVisible] = useState(false);

  const [codeId, setCodeId] = useState();

  const [number, setNumber] = useState(1);

  const [itemNumber,setItemNumber] = useState();

  const [items, setItems] = useState();

  const [stockDetails, setStockDetails] = useState();

  const { data: storehouseposition } = useRequest(storehousePositionsTreeView);

  // 扫码之后进行操作
  const code = async (codeId, items) => {
    const res = await request({
      url: '/orCode/backInkindByCode',
      method: 'POST',
      data: {
        codeId: codeId,
        id: items && items.skuId,
        brandId: items && items.brandId,
        storehouse: data && data.storehouseId,
      },
    });

    setCodeId(codeId);
    console.log(items);

    if (res && res.inkind) {
      // 扫描库存物料
      if (res.inkind.number > 1) {
        //批量出库
        if (itemNumber){
          setNumber(itemNumber < (res && res.inkind.number) ? itemNumber : (res.inkind.number))
          setVisible({ type: 2, ...res });
        }else {
          setNumber(items.number < (res && res.inkind.number) ? items.number : (res.inkind.number))
          setVisible({ type: 2, ...res });
        }

      } else {
        //直接出库
        setNumber(res.inkind.number)
        setVisible({ type: 1, ...res });
      }
    }

  };

  // 开启扫码
  const scan = async (items) => {
    if (process.env.NODE_ENV === 'development') {
      // 本地测试
      code(testCodeId, items);
    } else {
      await wx.ready(async () => {
        await wx.scanQRCode({
          desc: 'scanQRCode desc',
          needResult: 1, // 默认为0，扫描结果由企业微信处理，1则直接返回扫描结果，
          scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是条形码（一维码），默认二者都有
          success: async (res) => {
            if (res.resultStr.indexOf('https') !== -1) {
              const param = res.resultStr.split('=');
              if (param && param[1]) {
                //带路径的
                code(param[1], items);
              }
            } else {
              //不带路径的
              code(res.resultStr, items);
            }
          },
          error: (res) => {
            alert(res);
            if (res.errMsg.indexOf('function_not_exist') > 0) {
              // alert('版本过低请升级');
            }
          },
        });
      });
    }
  };


  const next = (items) => {
    Dialog.show({
      content: `出库成功！是否继续出库 [ ${items.sku && items.sku.skuName} / ${items.spuResult && items.spuResult.name} ]？`,
      closeOnMaskClick: true,
      closeOnAction: true,
      onAction: async (action) => {
        if (action.key === 'ok') {
          scan(items);
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

  if (!data) {
    return <Empty
      style={{ padding: '64px 0' }}
      imageStyle={{ width: 128 }}
      description='暂无数据'
    />;
  } else {
    return (
      <>
        <Card title='出库信息'>

          <List.Item>出库单号：{data.coding}</List.Item>
          <List.Item>仓库名称：{data.storehouseResult && data.storehouseResult.name}</List.Item>
          <List.Item>负责人：{data.userResult && data.userResult.name}</List.Item>
          <List.Item>备注：{data.note || '无'}</List.Item>
          <List.Item>创建时间：{data.createTime}</List.Item>

        </Card>

        <Card title='出库清单'>
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

                      <WhiteSpace size='sm' />
                    </Col>
                    <Col span={8} style={{ textAlign: 'center' }}>
                      <Space>
                        <Button
                          color='primary'
                          fill='none'
                          style={{ padding: 0 }}
                          onClick={async () => {

                            setItemNumber(items.number);

                            setItems(items);
                            //调用扫码
                            scan(items);

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
                            if (stockDetails && stockDetails.index && stockDetails.index === `${ index }`){
                              setStockDetails(false);
                            }else {
                              setStockDetails({ index:`${index}`, stockDetails:details });
                            }


                          }}
                        >{stockDetails && stockDetails.index && stockDetails.index === `${ index }` ? <><DownOutlined />收起库位</> :<><LeftOutlined />查看库位</>}</Button>
                      </Space>
                    </Col>
                  </Row>
                  {stockDetails && stockDetails.index && stockDetails.index === `${ index }` && <>
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
        </Card>


        <Card title='出库明细'>
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
        </Card>


        {/*------------------------------出库弹窗-------------------------*/}
        <Dialog
          visible={visible}
          content={
            <>
              {items && <>
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
              <WhiteSpace size='sm' />
              {items && items.brandResult && items.brandResult.brandName}
              <WhiteSpace size='sm' />
              {data && data.storehouseResult && data.storehouseResult.name} - {visible && visible.positions && visible.positions.name}
              <WhiteSpace size='sm' />
              库存数量:&nbsp;&nbsp;×{visible && visible.inkind && visible.inkind.number}
              <WhiteSpace size='sm' />
              {typeof visible === 'object' && visible.type === 2 && <Space>
                <div>
                  出库数量：
                </div>
                <Stepper
                  min={1}
                  max={itemNumber < (visible && visible.inkind.number) ? itemNumber : (visible && visible.inkind.number)}
                  value={number}
                  onChange={value => {
                    setNumber(value);
                  }}
                />
              </Space>}
            </>
          }
          onClose={() => {
            setVisible(false);
          }}
          onAction={async (action) => {
            if (action.key === 'out') {

              await request({
                url: '/orCode/outStockByCode',
                method: 'POST',
                data: {
                  number,
                  outstockOrderId: data && data.outstockOrderId,
                  storehouse: data && data.storehouseId,
                  codeId,
                  outstockListingId: items.outstockListingId,
                },
              }).then((res) => {
                if (res > 0) {
                  next(items);
                  setItemNumber(res);
                  setVisible(false);
                } else if (res === 0) {
                  Toast.show({
                    content: '出库成功！',
                  });
                  setVisible(false);
                } else {
                  // Toast.show({
                  //   content: '出库失败！',
                  //   icon: 'fail',
                  // });
                }
                typeof onChange === 'function' && onChange();
              });

            } else {
              setVisible(false);
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
        />
      </>
    );
  }
};

export default OutStock;

