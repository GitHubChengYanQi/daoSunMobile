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

  const defaultChart = [
    { code: 'Stock', name: '库存统计', sort: 0 },
    { code: 'ErrorSku', name: '异常分析', sort: 1 },
    { code: 'InventoryRotation', name: '在库天数', sort: 2 },
    { code: 'OrderStatisicalChart', name: '单据统计', sort: 3 },
    { code: 'MaterialAnalysis', name: '物料分析', sort: 4 },
    { code: 'TaskStatisicalChart', name: '任务统计', sort: 5 },
  ];

  useEffect(() => {
    if (userChart.length === 0) {
      props.dispatch({ type: 'data/getUserChar' });
    }
  }, []);

  useEffect(() => {
    titleChange(userChart.length === 0 ? defaultChart[0].name : userChart[0].name);
  }, [userChart.length]);

  return <>
    <Swiper loop autoplay onIndexChange={(index) => {
      const charts = (userChart.length === 0 ? defaultChart : userChart);
      titleChange(charts[index].name);
    }}>
      {
        (userChart.length === 0 ? defaultChart : userChart).map((item, index) => {
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
