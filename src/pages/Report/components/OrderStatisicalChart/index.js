import React from 'react';
import Canvas from '@antv/f2-react';
import { Chart, Axis, Interval, TextGuide } from '@antv/f2';
import { useHistory } from 'react-router-dom';

const OrderStatisicalChart = () => {

  const history = useHistory();

  const data = [
    {
      title: '入库',
      number: 385,
    },
    {
      title: '出库',
      number: 123,
    },
    {
      title: '盘点',
      number: 5342,
    },
    {
      title: '调拨',
      number: 1232,
    },
  ];


  const Total = (props) => {
    const { coord } = props;
    const { bottom, right } = coord;
    return (
      <group>
        <text
          attrs={{
            x: right,
            y: bottom,
            text: `合计 131 个`,
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
    history.push('/Report/OrderData');
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
