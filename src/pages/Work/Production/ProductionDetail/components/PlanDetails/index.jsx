import React from 'react';
import MyCard from '../../../../../components/MyCard';
import { MyDate } from '../../../../../components/MyDate';

const PlanDetails = ({ data }) => {

  return <>
    <MyCard title='执行时间' extra={<>{MyDate.Show(data.executionTime)} - {MyDate.Show(data.endTime)}</>} />
    <MyCard title='类型' />
    <MyCard title='执行人' extra={data.userResult?.name} />
    <MyCard title='物料清单' />
    <MyCard title='申请人' extra={data.userResult?.name} />
    <MyCard title='备注'>
      {data.remark || '无'}
    </MyCard>
    <MyCard title='附件' />
  </>;
};

export default PlanDetails;
