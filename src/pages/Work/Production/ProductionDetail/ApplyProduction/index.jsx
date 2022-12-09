import React from 'react';
import MyNavBar from '../../../../components/MyNavBar';
import MyCard from '../../../../components/MyCard';
import { Space } from 'antd';

const ApplyProduction = () => {


  return <>
    <MyNavBar title='申请投产' />
    <MyCard title='部件' extra={<Space size={24}><div>已投产：10</div><div>可投产：10</div></Space>}>

    </MyCard>
  </>;
};

export default ApplyProduction;
