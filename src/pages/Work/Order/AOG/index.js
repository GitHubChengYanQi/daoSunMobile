import React, { useState } from 'react';
import MyEmpty from '../../../components/MyEmpty';
import { Card, Dialog, Divider, List, Selector } from 'antd-mobile';
import { SkuResultSkuJsons } from '../../../Scan/Sku/components/SkuResult_skuJsons';
import { useSetState } from 'ahooks';
import Number from '../../../components/Number';
import LinkButton from '../../../components/LinkButton';
import { history } from 'umi';
import BottomButton from '../../../components/BottomButton';
import { useRequest } from '../../../../util/Request';
import { Col, Row } from 'antd';
import { MyLoading } from '../../../components/MyLoading';

const AOG = (props) => {

  const param = props.location.state;

  const [visible, setVisible] = useState();

  const { loading: enterpriseLoading, data: enterprise } = useRequest({ url: '/customer/detail', method: 'POST' });

  const adresses = (enterprise && enterprise.adressParams) ? (enterprise.adressParams.map((item) => {
    return {
      text: item.location,
      key: item.adressId,
    };
  })) : [];

  const [adressVisible, setAdressVisible] = useState();

  const [number, setNumber] = useState();

  const [value, onChange] = useState([]);

  const [details, setDetails] = useSetState({ data: param ? param.details : [] });

  const { loading, run } = useRequest({
    url: '/procurementOrderDetail/AOG',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: () => {
      Dialog.alert({
        content: '已确认，成功创建质检任务！',
      });
      history.goBack();
    },
  });

  if (!param) {
    return <MyEmpty />;
  }

  const { order } = param;

  if (!order || !details) {
    return <MyEmpty />;
  }

  return <>
    <Card
      style={{ height: '100vh' }}
      bodyStyle={{ maxHeight: '85%', overflowY: 'auto' }}
      title='订单列表'
      extra={<LinkButton title='返回' onClick={() => {
        history.goBack();
      }} />}>
      <Selector
        columns={1}
        options={
          details.data.map((item, index) => {
            return {
              key: item,
              label: <List
                style={{
                  textAlign: 'left',
                }}
              >
                <List.Item
                  arrow={false}
                  onClick={() => {
                    if (!value.includes(item.orderDetailId)) {
                      setVisible(item);
                      setNumber(item.theNumber || item.number);
                    }
                  }}
                  title={
                    <div style={{ fontSize: 16, color: '#000' }}>
                      {SkuResultSkuJsons({skuResult:item.skuResult})}
                    </div>
                  }
                  key={index}
                  description={<div>
                    <Divider style={{ margin: '8px 0' }} />
                    <Row gutter={24}>
                      <Col span={6} style={{ color: '#000' }}>应到:{item.number}</Col>
                      <Col span={6} style={{ color: 'green' }}>已到:{item.realizedNumber}</Col>
                      <Col span={6} style={{ color: 'blue' }}>本次:{item.theNumber || 0}</Col>
                      <Col span={6} style={{ color: 'red' }}>实到:{item.realizedNumber + (item.theNumber || 0)}</Col>
                    </Row>
                  </div>}
                >
                  <div>
                    品牌:{item.brandResult && item.brandResult.brandName}
                  </div>
                  <div>
                    供应商:{item.customerResult && item.customerResult.customerName}
                  </div>
                  <div>单价:{item.money}</div>
                </List.Item>
              </List>,
              value: item.orderDetailId,
            };
          })
        }
        multiple={true}
        onChange={(arr) => {
          onChange(arr);
        }}
      />
    </Card>

    <Dialog
      visible={visible}
      title='到货数量'
      content={<div style={{ textAlign: 'center' }}>
        <Number
          center
          show={visible}
          value={number}
          onChange={setNumber}
          color='blue' />
      </div>}
      onAction={() => {
        const array = details.data.map((item) => {
          if (item.orderDetailId === visible.orderDetailId) {
            return { ...item, theNumber: number };
          } else {
            return item;
          }
        });
        setDetails({ data: array });
        setVisible(false);
      }}
      actions={[
        {
          key: 'ok',
          text: '确定',
        },
      ]}
    />

    <Dialog
      visible={adressVisible}
      title='到货地点'
      onAction={(action) => {
        if (action.key === 'close') {
          return setAdressVisible(false);
        }
        const aogDetails = details.data.filter((item) => {
          return value.includes(item.orderDetailId) && item.theNumber > 0;
        });
        run({
          data: {
            orderId: order.procurementOrderId,
            place: action.key,
            aogDetails: aogDetails.map((item) => {
              return {
                detailsId: item.orderDetailId,
                number: item.theNumber,
              };
            }),
          },
        });
        setAdressVisible(false);
      }}
      actions={
        [
          ...adresses,
          {
            text: '取消',
            key: 'close',
          }]
      }
    />

    <BottomButton
      only
      loading={loading}
      disabled={value.length === 0}
      text='确认到货'
      onClick={() => {
        setAdressVisible(true);
      }}
    />

    {(loading || enterpriseLoading) && <MyLoading />}

  </>;
};

export default AOG;
