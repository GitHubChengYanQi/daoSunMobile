import React from 'react';
import MyNavBar from '../../../components/MyNavBar';
import MyCard from '../../../components/MyCard';
import { useRequest } from '../../../../util/Request';
import { paymentDetail } from '../url';
import { MyLoading } from '../../../components/MyLoading';
import { useLocation } from 'react-router-dom';

const PaymentDetail = () => {

  const { query } = useLocation();

  const { loading, data = {} } = useRequest({ ...paymentDetail, data: { recordId: query.recordId } });

  if (loading) {
    return <MyLoading skeleton />;
  }

  return <>
    <MyNavBar title='付款详情' />
    <MyCard title='关联订单' extra={data.coding} />
    <MyCard title='供应商' extra={data.coding} />
    <MyCard title='金额' extra={data.paymentAmount + ' 人民币'} />
    <MyCard title='备注' extra={data.remark} />
    <MyCard title='创建时间' extra={data.createTime} />
  </>;
};

export default PaymentDetail;
