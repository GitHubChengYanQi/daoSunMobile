import Canvas from '@antv/f2-react';
import { Chart, Tooltip, Axis, Line, TextGuide } from '@antv/f2';
import React from 'react';
import { useHistory } from 'react-router-dom';

const ErrorSku = () => {

  const history = useHistory();

  const data = [
    { date: '1月', value: 116 },
    { date: '2月', value: 2141 },
    { date: '3月', value: 1232 },
    { date: '4月', value: 234 },
    { date: '5月', value: 5467 },
    { date: '6月', value: 342 },
  ];

  return <div onClick={() => {
    history.push('/Report/SkuErrorData');
  }}>
    <Canvas pixelRatio={window.devicePixelRatio} height={200}>
      <Chart data={data}>
        <Axis
          field='date'
          tickCount={12}
          style={{
            label: { align: 'between' },
          }}
        />
        <Axis field='value' tickCount={5} />
        <Line x='date' y='value' />
        <Tooltip />
        {data.map((record) => {
          return (
            <TextGuide
              key={record.date}
              records={[record]}
              content={record.value}
              offsetY={-10}
              style={{
                fill: '#EA0000',
                fontSize: '20px',
                textBaseline: 'middle',
                textAlign: 'center',
              }}
            />
          );
        })}
      </Chart>
    </Canvas>
  </div>;
};

export default ErrorSku;
