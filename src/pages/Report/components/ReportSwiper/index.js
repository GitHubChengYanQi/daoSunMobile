import React from 'react';
import { Swiper } from 'antd-mobile';
import MaterialAnalysis from '../MaterialAnalysis';
import InventoryRotation from '../InventoryRotation';
import WorkEfficiency from '../WorkEfficiency';
import ErrorSku from '../ErrorSku';

const ReportSwiper = () => {


  return <>
    <Swiper loop autoplay onIndexChange={(index) => {

    }}>
      <Swiper.Item key='1'>
        <MaterialAnalysis />
      </Swiper.Item>
      <Swiper.Item key='2'>
        <InventoryRotation />
      </Swiper.Item>
      <Swiper.Item key='3'>
        <WorkEfficiency />
      </Swiper.Item>
      <Swiper.Item key='4'>
        <ErrorSku />
      </Swiper.Item>
    </Swiper>
  </>
};

export default ReportSwiper;
