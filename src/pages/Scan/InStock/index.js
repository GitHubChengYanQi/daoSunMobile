import { Button, Card, Dialog,  Empty, List, Space, Toast } from 'antd-mobile';
import { Col, Row } from 'antd';
import { BarsOutlined, ScanOutlined } from '@ant-design/icons';
import wx from 'populee-weixin-js-sdk';
import React, { useState } from 'react';
import MyTreeSelect from '../../components/MyTreeSelect';
import { storehousePositionsTreeView } from '../Url';
import { request } from '../../../util/Request';


const InStock = ({ data,onChange }) => {

  const [visible, setVisible] = useState(false);

  const [stroeHousePostion, setStroeHousePostion] = useState();

  const [codeId, setCodeId] = useState();

  const [items, setItems] = useState();

  const scan = () => {
    if ( process.env.NODE_ENV === 'development'){
      return '1458331618037211137';
    }else {
      wx.ready(() => {
        wx.scanQRCode({
          desc: 'scanQRCode desc',
          needResult: 1, // 默认为0，扫描结果由企业微信处理，1则直接返回扫描结果，
          scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是条形码（一维码），默认二者都有
          success: (res) => {
            return res;
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

  const bind = (codeId,items) => {
    Dialog.show({
      content: '是否绑定物料？',
      closeOnMaskClick: true,
      closeOnAction: true,
      onAction: async (action) => {
        if (action.key === 'ok') {
          setVisible(true);
          if (codeId && items){
            await request({
              url:'/orCode/backCode',
              method:'POST',
              data:{
                codeId: codeId,
                source: 'item',
                ...items,
                id:items.skuId
              }
            }).then(()=>{
              Toast.show({
                content:'绑定成功！'
              });
              setVisible(true);
            })
          }
        }else {
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

  const code = async (codeId,items) => {
    setCodeId(codeId);
    const isBind = await request(
      {
        url:'/orCode/isNotBind',
        method:'POST',
        data:{
          codeId:codeId,
        }
      }
    );
    // 判断是否是未绑定过的码
    if (isBind) {
      //如果已绑定，判断扫码的物料是否和选中的物料一致
      const judgeBind = await request({
        url:'/orCode/judgeBind',
        method:'POST',
        data:{
          codeId:codeId,
          Id:items.skuId,
          type:'item',
        }})
      if (judgeBind === true) {
        setVisible(true);
      } else {
        //不一致报错
        Toast.show({
          content: '物料信息不符！',
          icon: 'fail',
        });
      }
    } else {
      //如果未绑定，提示用户绑定
      bind(codeId,items);
    }
  }

  const next = (items) => {
    Dialog.show({
      content: '是否继续？',
      closeOnMaskClick: true,
      closeOnAction: true,
      onAction: async (action) => {

        if (action.key === 'ok') {
          const res = scan();

          code(res,items);
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

          <List.Item>入库单号：{data.instockOrderId}</List.Item>
          <List.Item>仓库名称：{data.storehouseResult && data.storehouseResult.name}</List.Item>
          <List.Item>负责人：{data.userResult && data.userResult.name}</List.Item>
          <List.Item>入库类别：{data.type}</List.Item>
          <List.Item>创建时间：{data.createTime}</List.Item>

        </Card>

        <Card title='入库清单'>
          <List.Item>
            <Row gutter={24}>
              <Col span={9} style={{ textAlign: 'center' }}>
                物料
              </Col>
              <Col span={6}>
                品牌
              </Col>
              <Col span={4}>
                数量
              </Col>
              <Col span={5}>
                操作
              </Col>
            </Row>
          </List.Item>
          {data.instockListResults && data.instockListResults.length > 0 ?
            data.instockListResults.map((items, index) => {
              return <List.Item key={index}>
                <Row gutter={24}>
                  <Col span={9}>
                    {items.sku && items.sku.skuName}
                    &nbsp;/&nbsp;
                    {items.spuResult && items.spuResult.name}
                    &nbsp;&nbsp;
                    <br />
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
                  <Col span={6}>
                    {items.brandResult && items.brandResult.brandName}
                  </Col>
                  <Col span={4}>
                    {items.number}
                  </Col>
                  <Col span={5}>
                    <Space>
                      <Button
                        color='primary'
                        fill='none'
                        style={{ padding: 0 }}
                        onClick={async () => {

                          // setVisible(true);
                          setItems(items);

                          const res = scan();

                          code(res,items);
                        }}
                      ><ScanOutlined /></Button>
                      <Button
                        color='primary'
                        fill='none'
                        style={{ padding: 0 }}
                        onClick={() => {

                        }}
                      ><BarsOutlined /></Button>
                    </Space>
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


        <Card title='入库明细'>
          <List.Item>
            <Row gutter={24}>
              <Col span={9} style={{ textAlign: 'center' }}>
                物料
              </Col>
              <Col span={6}>
                品牌
              </Col>
              <Col span={9}>
                仓库库位
              </Col>
            </Row>
          </List.Item>
          {data.instockResults && data.instockResults.length > 0 ?
            data.instockResults.map((items, index) => {
              return <List.Item key={index}>
                <Row gutter={24}>
                  <Col span={9}>
                    {items.sku && items.sku.skuName}
                    &nbsp;/&nbsp;
                    {items.spuResult && items.spuResult.name}
                    &nbsp;&nbsp;
                    <br />
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
                  <Col span={6}>
                    {items.brandResult && items.brandResult.brandName}
                  </Col>
                  <Col span={9}>
                    {items.storehousePositions && items.storehousePositions.name}
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

        <Dialog
          visible={visible}
          content={
            <Space>
              <MyTreeSelect
                title='选择库位'
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
              <Button
                color='primary'
                fill='none'
                style={{ padding: 0 }}
                onClick={() => {
                  const res = scan();
                  console.log(res);
                }}
              ><ScanOutlined /></Button>
            </Space>
          }
          onClose={() => {
            setVisible(false);
          }}
          onAction={async (action) => {
            if (action.key === 'instock') {
              if (stroeHousePostion){
                await request({url:'/orCode/instockByCode',method:'POST', data:{
                    type:'item',
                    codeId:codeId,
                    Id:items.skuId,
                    instockListParam:{
                      ...items,storehousePositionsId:stroeHousePostion
                    }
                  } }).then(()=>{
                  next(items);
                  typeof onChange === 'function' && onChange();
                  setVisible(false);
                  setStroeHousePostion(false);
                })
              }else {
                Toast.show({
                  content:'请选择库位！'
                });
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
      </>
    );
  }
};

export default InStock;
