import React from 'react';
import MyNavBar from '../../../components/MyNavBar';
import MyCard from '../../../components/MyCard';
import { useRequest } from '../../../../util/Request';
import { invoiceDetail } from '../url';
import { MyLoading } from '../../../components/MyLoading';
import { useLocation } from 'react-router-dom';
import UploadFile from '../../../components/Upload/UploadFile';

const InvoiceDetail = () => {

  const { query } = useLocation();

  const { loading, data = {} } = useRequest({ ...invoiceDetail, data: { invoiceBillId: query.invoiceBillId } });

  if (loading) {
    return <MyLoading skeleton />;
  }

  return <>
    <MyNavBar title='发票详情' />
    <MyCard title='关联订单' extra={data.coding} />
    <MyCard title='供应商' extra={data.coding} />
    <MyCard title='名称' extra={data.name} />
    <MyCard title='金额' extra={data.money + ' 人民币'} />
    <MyCard title='附件'>
      <UploadFile files={[]} show file />
    </MyCard>
    <MyCard title='发票日期' extra={data.invoiceDate} />
    <MyCard title='创建时间' extra={data.createTime} />
  </>;
};

export default InvoiceDetail;
