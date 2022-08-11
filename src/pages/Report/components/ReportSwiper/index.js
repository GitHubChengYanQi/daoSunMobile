import React from 'react';
import { Swiper } from 'antd-mobile';
import MaterialAnalysis from '../MaterialAnalysis';
import InventoryRotation from '../InventoryRotation';
import ErrorSku from '../ErrorSku';
import Stock from '../Stock';
import OrderStatisicalChart from '../OrderStatisicalChart';
import TaskStatisicalChart from '../TaskStatisicalChart';

const ReportSwiper = () => {


  return <>
    <Swiper loop autoplay onIndexChange={(index) => {

    }}>
      <Swiper.Item key='1'>
        <Stock />
      </Swiper.Item>
      <Swiper.Item key='2'>
        <ErrorSku />
      </Swiper.Item>
      <Swiper.Item key='3'>
        <InventoryRotation />
      </Swiper.Item>
      <Swiper.Item key='4'>
        <OrderStatisicalChart />
      </Swiper.Item>
      <Swiper.Item key='4'>
        <TaskStatisicalChart />
      </Swiper.Item>
      <Swiper.Item key='4'>
        <MaterialAnalysis noIndicator />
      </Swiper.Item>
    </Swiper>
  </>;
};

export default ReportSwiper;
