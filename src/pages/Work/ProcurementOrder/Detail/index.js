import React from 'react';
import { procurementOrderDetail, procurementOrderDetailEdit, procurementOrderDetailList } from '../Url';
import { useRequest } from '../../../../util/Request';
import { Skeleton } from 'weui-react-v2';
import { Button, Card, Dialog, List, Space } from 'antd-mobile';
import MyEmpty from '../../../components/MyEmpty';
import SkuResultSkuJsons from '../../../Scan/Sku/components/SkuResult_skuJsons';
import BottomButton from '../../../components/BottomButton';
import { history } from 'umi';
import { Badge } from 'antd';
import LinkButton from '../../../components/LinkButton';
import { MyLoading } from '../../../components/MyLoading';

const Detail = (props) => {

  const { id } = props.location.query;

  const { loading, data,refresh } = useRequest(procurementOrderDetail, {
    defaultParams: {
      data: {
        procurementOrderId: id,
      },
    },
  });

  const { loading: editLoading, run: editRun } = useRequest(procurementOrderDetailEdit, {
    manual: true,
    onSuccess:()=>{refresh();}
  });

  const {
    loading: detailLoading,
    data: detailData,
  } = useRequest(procurementOrderDetailList, { defaultParams: { data: { procurementOrderId: id } } });

  if (loading || detailLoading) {
    return <Skeleton loading={loading || detailLoading} />;
  }

  if (!id || !data || !detailData) {
    return <MyEmpty />;
  }
  const status = (value) => {
    switch (value) {
      case 0:
        return <Badge text='审批中' color='yellow' />;
      case 97:
        return <Badge text='已拒绝' color='red' />;
      case 98:
        return <Badge text='已完成' color='green' />;
      case 99:
        return <Badge text='已同意' color='blue' />;
      default:
        break;
    }
  };

  return <Card
    style={{ height: '100vh' }}
    bodyStyle={{ maxHeight: '85%', overflowY: 'auto' }}
    title='采购单详情'
    extra={<LinkButton title='返回' onClick={() => {
      history.goBack();
    }} />}>
    <Card title='基本信息'>
      <List
        style={{
          '--border-top': 'none',
          '--border-bottom': 'none',
        }}
      >
        <List.Item extra={data.procurementOrderId}>采购单号</List.Item>
        <List.Item extra={data.user && data.user.name}>创建人</List.Item>
        <List.Item extra={data.createTime}>创建时间</List.Item>
        <List.Item extra={status(data.status)}>状态</List.Item>
      </List>
    </Card>
    <Card title='订单信息'>
      <List
        style={{
          '--border-top': 'none',
          '--border-bottom': 'none',
        }}
      >
        {
          detailData.map((item, index) => {
            return <List.Item
              title={
                <div style={{ fontSize: 16, color: '#000' }}>
                  <SkuResultSkuJsons skuResult={item.skuResult} />
                </div>
              }
              key={index}
              extra={
                <Button style={{ '--border-radius': '10px', color: '#1845b5' }}>
                  <Space direction='vertical'>
                    <div style={{ color: '#000' }}>应到:{item.number}</div>
                    <div style={{ color: 'green' }}>实到:{item.realizedNumber}</div>
                  </Space>
                </Button>
              }
              description={<div>单价:{item.money}</div>}
            >
              <div>
                品牌:{item.brandResult && item.brandResult.brandName}
              </div>
              <div>
                供应商:{item.customerResult && item.customerResult.customerName}
              </div>
            </List.Item>;
          })
        }
      </List>
    </Card>

    {editLoading && <MyLoading />}

    {data.status === 99 && <BottomButton
      rightText='确认到货'
      rightOnClick={() => {
        history.push({
          pathname: '/Work/ProcurementOrder/AOG',
          state: {
            order: data,
            details: detailData,
          },
        });
      }}
      leftText='完成订单'
      leftOnClick={() => {
        Dialog.confirm({
          title: '确定完成当前订单？',
          onConfirm: () => {
            return editRun({
              params: {
                Id:id,
              },
            });
          },
        });
      }}
    />}
  </Card>;
};

export default Detail;
