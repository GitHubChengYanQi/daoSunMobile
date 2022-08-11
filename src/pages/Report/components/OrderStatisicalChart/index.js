import React from 'react';
import Canvas from '@antv/f2-react';
import { Chart, Axis, Interval, TextGuide } from '@antv/f2';
import { useHistory } from 'react-router-dom';
import { useRequest } from '../../../../util/Request';
import { MyLoading } from '../../../components/MyLoading';

export const billCountView = { url: '/statisticalView/billCountView', method: 'GET' };

const OrderStatisicalChart = () => {

  const history = useHistory();

  const { loading, data: orderCount } = useRequest(billCountView);

  const orderDetail = orderCount || {};

  const data = [
    {
      title: '入库',
      number: orderDetail.instockCount,
    },
    {
      title: '出库',
      number: orderDetail.outstockCont,
    },
    {
      title: '盘点',
      number: orderDetail.inventoryCount,
    },
    {
      title: '养护',
      number: orderDetail.maintenanceCount,
    },
    {
      title: '调拨',
      number: orderDetail.allocationCount,
    },
  ];

  const total = orderDetail.instockCount + orderDetail.outstockCont + orderDetail.inventoryCount + orderDetail.maintenanceCount + orderDetail.allocationCount;

  if (loading) {
    return <MyLoading skeleton />;
  }

  const Total = (props) => {
    const { coord } = props;
    const { bottom, right } = coord;
    return (
      <group>
        <text
          attrs={{
            x: right,
            y: bottom,
            text: `合计 ${total || 0} 个`,
            textAlign: 'end',
            textBaseline: 'bottom',
            fontSize: '40px',
            fill: '#ddd',
          }}
        />
      </group>
    );
  };

  return <div onClick={() => {
    const pathname = history.location.pathname;
    const url = '/Report/OrderData';
    if (pathname !== url) {
      history.push(url);
    }
  }}>
    <Canvas pixelRatio={window.devicePixelRatio} height={200}>
      <Chart
        data={data}
        coord={{
          transposed: true,
        }}
        scale={{
          sales: {
            tickCount: 5,
          },
        }}
      >
        <Total />
        <Axis field='title' style={{
          line: {
            opacity: 0,
          },
        }} />
        <Interval x='title' y='number' />
        {data.map((record) => {
          return (
            <TextGuide
              key={record.title}
              records={[record]}
              content={record.number}
              offsetX={4}
              style={{
                fill: '#666',
                fontSize: '20px',
                textBaseline: 'middle',
              }}
            />
          );
        })}
      </Chart>
    </Canvas>
  </div>;
};

export default OrderStatisicalChart;
