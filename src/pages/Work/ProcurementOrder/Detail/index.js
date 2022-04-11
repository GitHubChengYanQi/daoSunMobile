import React, { useState } from 'react';
import { orderDetail } from '../Url';
import { useRequest } from '../../../../util/Request';
import { Card, Space, Tabs } from 'antd-mobile';
import MyEmpty from '../../../components/MyEmpty';
import BottomButton from '../../../components/BottomButton';
import { MyLoading } from '../../../components/MyLoading';
import MyNavBar from '../../../components/MyNavBar';
import Label from '../../../components/Label';
import MyFloatingPanel from '../../../components/MyFloatingPanel';
import Skus from './components/Skus';
import Pays from './components/Pays';
import { history } from 'umi';

const Detail = (props) => {

  const { id } = props.location.query;

  const [key, setKey] = useState('skus');

  const { loading, data } = useRequest(orderDetail, {
    defaultParams: {
      data: {
        orderId: id,
      },
    },
  });

  console.log(data);

  if (loading) {
    return <MyLoading />;
  }

  if (!data) {
    return <MyEmpty />;
  }

  const backgroundBom = () => {
    return <>
      <Card title={<div>基本信息</div>}>
        <Space direction='vertical'>
          <div>
            <Label>采购单号：</Label>{data.coding}
          </div>
          <div>
            <Label>创建时间：</Label>{data.createTime}
          </div>
        </Space>
      </Card>
      <Card title={<div>甲方信息</div>}>
        <Space direction='vertical'>
          <div>
            <Label>公司：</Label>{data.acustomer && data.acustomer.customerName}
          </div>
          <div>
            <Label>联系人：</Label>{data.acontacts && data.acontacts.contactsName}
          </div>
          <div>
            <Label>电话：</Label>{data.aphone && data.aphone.phoneNumber}
          </div>
        </Space>
      </Card>
      <Card title={<div>乙方信息</div>}>
        <Space direction='vertical'>
          <div>
            <Label>公司：</Label>{data.bcustomer && data.bcustomer.customerName}
          </div>
          <div>
            <Label>联系人：</Label>{data.bcontacts && data.bcontacts.contactsName}
          </div>
          <div>
            <Label>电话：</Label>{data.bphone && data.bphone.phoneNumber}
          </div>
        </Space>
      </Card>
    </>;
  };

  const module = () => {
    switch (key) {
      case 'skus':
        return <Skus skus={data.detailResults} data={data} />;
      case 'pay':
        return <Pays pays={data.paymentResult && data.paymentResult.detailResults} payment={data.paymentResult} />;
      default:
        return <MyEmpty />;
    }
  };

  return <>
    <MyNavBar title='采购单详情' />

    <MyFloatingPanel
      backgroundDom={backgroundBom()}
    >
      <Tabs
        activeKey={key}
        style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 999 }}
        onChange={(key) => {
          setKey(key);
        }}
      >
        <Tabs.Tab title='物料信息' key='skus' />
        <Tabs.Tab title='付款信息' key='pay' />
      </Tabs>
      {module()}
    </MyFloatingPanel>

    <BottomButton
      only
      text='确认到货'
      disabled={!data.detailResults || data.detailResults.length === 0}
      onClick={() => {
        const skus = data.detailResults.map((item) => {
          return {
            skuId: item.skuId,
            number: item.purchaseNumber,
            brandId: item.brandId,
            customerId: item.customerId,
            brandName: item.brandResult && item.brandResult.brandName,
            customerName: item.customerResult && item.customerResult.customerName,
          };
        });
        history.push(`/Work/Instock/CreateInStock?skus=${JSON.stringify(skus)}`);
      }}
    />
  </>;
};

export default Detail;
