import React, { useEffect } from 'react';
import { Swiper } from 'antd-mobile';
import MaterialAnalysis from '../MaterialAnalysis';
import InventoryRotation from '../InventoryRotation';
import ErrorSku from '../ErrorSku';
import Stock from '../Stock';
import OrderStatisicalChart from '../OrderStatisicalChart';
import TaskStatisicalChart from '../TaskStatisicalChart';
import { connect } from 'dva';

const ReportSwiper = (
  {
    titleChange = () => {
    },
    ...props
  },
) => {

  const userChart = props.data && props.data.userChart || [];

  useEffect(() => {
    if (userChart.length === 0) {
      props.dispatch({ type: 'data/getUserChar' });
    }
  }, []);

  useEffect(() => {
    titleChange(userChart[0] && userChart[0].name);
  }, [userChart.length]);

  return userChart.length > 0 && <>
    <Swiper loop autoplay onIndexChange={(index) => {
      const charts = (userChart);
      titleChange(charts[index].name);
    }}>
      {
        userChart.map((item, index) => {
          switch (item.code) {
            case 'Stock':
              return <Swiper.Item key={index}>
                <Stock />
              </Swiper.Item>;
            case 'ErrorSku':
              return <Swiper.Item key={index}>
                <ErrorSku height={150} />
              </Swiper.Item>;
            case 'InventoryRotation':
              return <Swiper.Item key={index}>
                <InventoryRotation height={150} />
              </Swiper.Item>;
            case 'OrderStatisicalChart':
              return <Swiper.Item key={index}>
                <OrderStatisicalChart height={150} />
              </Swiper.Item>;
            case 'TaskStatisicalChart':
              return <Swiper.Item key={index}>
                <TaskStatisicalChart height={150} />
              </Swiper.Item>;
            case 'MaterialAnalysis':
              return <Swiper.Item key={index}>
                <MaterialAnalysis noIndicator height={150} />
              </Swiper.Item>;
            default:
              return <div key={index} />;
          }
        })
      }
    </Swiper>
  </>;
};

export default connect(({ data }) => ({ data }))(ReportSwiper);
