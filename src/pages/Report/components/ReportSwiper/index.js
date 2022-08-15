import React from 'react';
import { Swiper } from 'antd-mobile';
import MaterialAnalysis from '../MaterialAnalysis';
import InventoryRotation from '../InventoryRotation';
import ErrorSku from '../ErrorSku';
import Stock from '../Stock';
import OrderStatisicalChart from '../OrderStatisicalChart';
import TaskStatisicalChart from '../TaskStatisicalChart';

const ReportSwiper = (
  {
    titleChange = () => {
    },
  },
) => {


  return <>
    <Swiper loop autoplay onIndexChange={(index) => {
      let title = '';
      switch (index) {
        case 0:
          title = '库存统计';
          break;
        case 1:
          title = '异常分析';
          break;
        case 2:
          title = '在库天数';
          break;
        case 3:
          title = '单据统计';
          break;
        case 4:
          title = '任务统计';
          break;
        case 5:
          title = '物料分析';
          break;
        default:
          title = '库存统计';
          break;
      }
      titleChange(title);
    }}>
      <Swiper.Item key='1'>
        <Stock />
      </Swiper.Item>
      <Swiper.Item key='2'>
        <ErrorSku height={150} />
      </Swiper.Item>
      <Swiper.Item key='3'>
        <InventoryRotation height={150} />
      </Swiper.Item>
      <Swiper.Item key='4'>
        <OrderStatisicalChart height={150} />
      </Swiper.Item>
      <Swiper.Item key='5'>
        <TaskStatisicalChart height={150} />
      </Swiper.Item>
      <Swiper.Item key='6'>
        <MaterialAnalysis noIndicator height={150} />
      </Swiper.Item>
    </Swiper>
  </>;
};

export default ReportSwiper;
