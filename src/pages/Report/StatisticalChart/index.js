import React from 'react';
import MyCard from '../../components/MyCard';
import { Space, Switch } from 'antd-mobile';
import MyNavBar from '../../components/MyNavBar';
import Stock from '../components/Stock';
import ErrorSku from '../components/ErrorSku';
import InventoryRotation from '../components/InventoryRotation';
import OrderStatisicalChart from '../components/OrderStatisicalChart';
import TaskStatisicalChart from '../components/TaskStatisicalChart';
import MaterialAnalysis from '../components/MaterialAnalysis';

const StatisticalChart = () => {


  const extra = () => {
    return <Space>常用列表 <Switch
      style={{ '--height': '24px', '--width': '64px' }}
      onChange={(checked) => {

      }} /></Space>;
  };

  return <>
    <MyNavBar title='统计图表设置' />
    <MyCard title='库存统计' extra={extra()}>
      <Stock />
    </MyCard>

    <MyCard title='异常分析' extra={extra()}>
      <ErrorSku />
    </MyCard>

    <MyCard title='在库天数' extra={extra()}>
      <InventoryRotation />
    </MyCard>

    <MyCard title='单据统计' extra={extra()}>
      <OrderStatisicalChart />
    </MyCard>

    <MyCard title='任务统计' extra={extra()}>
      <TaskStatisicalChart />
    </MyCard>

    <MyCard title='物料分析' extra={extra()}>
      <MaterialAnalysis />
    </MyCard>
  </>;
};

export default StatisticalChart;
