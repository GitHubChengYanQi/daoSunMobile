import React from 'react';
import MyCard from '../../../../components/MyCard';
import { UserName } from '../../../../components/User';

const AllocationLog = () => {


  return <>
    <MyCard title='调拨明细'>

    </MyCard>

    <MyCard title='调入仓库' extra='无' />

    <MyCard title='收货人' extra={<UserName />} />

    <MyCard title='来源' extra='无' />

    <MyCard title='审批人'>

    </MyCard>
  </>;
};

export default AllocationLog;
