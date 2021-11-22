import { Button, Card, Dialog, Empty, List, Space, Stepper, Toast } from 'antd-mobile';
import { Col, Row } from 'antd';
import { BarsOutlined, ScanOutlined } from '@ant-design/icons';
import wx from 'populee-weixin-js-sdk';
import React, { useState } from 'react';
import MyTreeSelect from '../../components/MyTreeSelect';
import { storehousePositionsTreeView } from '../Url';
import { request, useRequest } from '../../../util/Request';
import { useBoolean } from 'ahooks';
import TreeSelectSee from '../../components/TreeSelectSee';
import { WhiteSpace } from 'weui-react-v2';

const testCodeId = '1461922566356918273';

const InStock = ({ data, onChange }) => {

  const [visible, setVisible] = useState(false);

  const [stroeHousePostion, setStroeHousePostion] = useState();

  const [batch, setBatch] = useState(false);

  const [codeId, setCodeId] = useState();

  const [items, setItems] = useState();

  const [visibleNumber, setVisibleNumber] = useState(false);

  const [number, setNumber] = useState(1);

  const [instockNumber, setInstockNumber] = useState(0);

  const [show, { toggle }] = useBoolean();

  const { loading, data: storehouseposition } = useRequest(storehousePositionsTreeView);

  const scanStorePostion = async (id) => {
    const res = await request({
      url: '/orCode/backObject',
      method: 'GET',
      params: { id },
    });
    if (res.type === 'storehousePositions') {
      if (res.result && res.result.storehouseId) {
        if (res.result.storehouseId === data.storeHouseId) {
          setStroeHousePostion(res.result);
        } else {
          Toast.show({
            content: `请扫[ ${data.storehouseResult && data.storehouseResult.name} ] 的码！`,
            icon: 'fail',
          });
        }
      }

    } else {
      Toast.show({
        content: '请扫库位码！',
        icon: 'fail',
      });
    }
  };

  const scanStorehousePositon = () => {
    return <Button
      color='primary'
      fill='none'
      style={{ padding: 0 }}
      onClick={() => {
        //扫描库位
        wx.ready(async () => {
          await wx.scanQRCode({
            desc: 'scanQRCode desc',
            needResult: 1, // 默认为0，扫描结果由企业微信处理，1则直接返回扫描结果，
            scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是条形码（一维码），默认二者都有
            success: async (res) => {
              if (res.resultStr.indexOf('https') !== -1) {
                const param = res.resultStr.split('=');
                if (param && param[1]) {
                  scanStorePostion(param[1]);
                }
              } else {
                scanStorePostion(res.resultStr);
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
      }}
    ><ScanOutlined />扫描库位</Button>;
  };


  // 判断二维码状态
  const code = async (codeId, items,batch) => {
    setCodeId(codeId);
    setBatch(batch);
    const isBind = await request(
      {
        url: '/orCode/isNotBind',
        method: 'POST',
        data: {
          codeId: codeId,
        },
      },
    );
    // 判断是否是未绑定过的码
    if (isBind) {
      //如果已绑定，判断扫码的物料是否已经入库
      const judgeBind = await request({
        url: '/orCode/judgeBind',
        method: 'POST',
        data: {
          codeId: codeId,
          Id: items.skuId,
          type: 'item',
          ...items,
        },
      });
      if (judgeBind === true) {
          setVisible(true);
      } else {
        //不一致报错
        Toast.show({
          content: '二维码已绑定其他物料，或物料已绑定其他二维码！请重新选择!',
          icon: 'fail',
        });
      }
    } else {
      setVisibleNumber(false);
      //如果未绑定，提示用户绑定
      if (batch){
        setVisibleNumber(true);
      }else {
        bind(codeId, items);
      }
    }
  };

  // 开启扫码
  const scan = async (items,batch) => {
    if (process.env.NODE_ENV === 'development') {
      code(testCodeId, items,batch);
    } else {
      await wx.ready(async () => {
        await wx.scanQRCode({
          desc: 'scanQRCode desc',
          needResult: 1, // 默认为0，扫描结果由企业微信处理，1则直接返回扫描结果，
          scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是条形码（一维码），默认二者都有
          success: (res) => {
            if (res.resultStr.indexOf('https') !== -1) {
              const param = res.resultStr.split('=');
              if (param && param[1]) {
                code(param[1], items,batch);
              }
            } else {
              code(res.resultStr, items,batch);
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

  const bind = (codeId, items) => {
    Dialog.show({
      content: `“ ${items.sku && items.sku.skuName} \\ ${items.spuResult && items.spuResult.name} ”是否绑定此二维码？`,
      closeOnMaskClick: true,
      closeOnAction: true,
      onAction: async (action) => {
        if (action.key === 'ok') {

          await request({
            url: '/orCode/backCode',
            method: 'POST',
            data: {
              codeId: codeId,
              source: 'item',
              ...items,
              id: items.skuId,
              number,
              inkindType:'入库',
            },
          }).then((res) => {
            if (typeof res === 'string') {
              Toast.show({
                content: '绑定成功！',
              });
              setVisible(true);
            }
          });

        } else {
          // typeof onChange === 'function' && onChange();
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

  const next = (items) => {
    Dialog.show({
      content: `“ ${items.sku && items.sku.skuName} / ${items.spuResult && items.spuResult.name} “是否要继续${batch ? '批量入库' : '扫码入库'} ？`,
      closeOnMaskClick: true,
      closeOnAction: true,
      onAction: async (action) => {
        if (action.key === 'ok') {
          if (batch) {
            setVisibleNumber(true);
          } else {
            scan(items);
          }
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
        <Card title='入库信息'>

          <List.Item>入库单号：{data.coding}</List.Item>
          <List.Item>仓库名称：{data.storehouseResult && data.storehouseResult.name}</List.Item>
          <List.Item>负责人：{data.userResult && data.userResult.name}</List.Item>
          <List.Item>入库类别：{data.type || '手动添加'}</List.Item>
          <List.Item>创建时间：{data.createTime}</List.Item>

        </Card>

        <Card title='入库清单'>
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

                            if (items.number !== 0) {
                              setItems(items);
                              setInstockNumber(items.number);
                              setNumber(items.number);
                              scan(items);
                            } else {
                              Toast.show({
                                content: '已全部入库！',
                              });
                            }

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
                          onClick={() => {
                            setItems(items);
                            setInstockNumber(items.number);
                            setNumber(items.number);
                            scan(items,true);
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
        </Card>

        {loading ?
          <Empty
            style={{ padding: '64px 0' }}
            imageStyle={{ width: 128 }}
            description='暂无数据'
          />
          :
          <Card title='入库明细'>
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
          </Card>}

        {/*---------------------------------选择库位进行入库操作----------------------*/}
        <Dialog
          visible={visible}
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
            <div style={{textAlign:'center'}}>
              <Space direction='vertical'>
                <MyTreeSelect
                  poputTitle={scanStorehousePositon()}
                  title='选择库位'
                  value={typeof stroeHousePostion === 'object' ? stroeHousePostion.storehousePositionsId : stroeHousePostion}
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
                  }}
                  clear={() => {
                    // setStroeHousePostion(false);
                  }}
                />

                {scanStorehousePositon()}
              </Space>
            </div>
          }
          onClose={() => {
            setVisible(false);
          }}
          onAction={async (action) => {
            if (action.key === 'instock') {
              if (stroeHousePostion) {
                await request({
                  url: '/orCode/instockByCode', method: 'POST', data: {
                    type: 'item',
                    codeId: codeId,
                    Id: items.skuId,
                    instockListParam: {
                      ...items,
                      codeId: codeId,
                      storehousePositionsId: typeof stroeHousePostion === 'object' ? stroeHousePostion.storehousePositionsId : stroeHousePostion,
                    },
                  },
                }).then((res) => {
                  if (res !== 0) {
                    setInstockNumber(res);
                    setNumber(res);
                    next(items);
                  } else {
                    Toast.show({
                      content: '已经全部入库！',
                    });
                  }
                  typeof onChange === 'function' && onChange();
                  setNumber(1);
                  setVisible(false);
                });
              } else {
                toggle();
              }
              //如果入库成功
            } else {
              setVisible(false);
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
          visible={visibleNumber}
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
            setVisibleNumber(false);
          }}
          onAction={async (action) => {
            if (action.key === 'next') {
              if (number > instockNumber) {
                Toast.show({
                  content: '不能超过未入库数量！',
                });
              } else {
                bind(codeId, items);
                setVisibleNumber(false);
              }
            } else {
              setVisibleNumber(false);
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
      </>
    );
  }
};

export default InStock;
