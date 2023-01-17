import Canvas from "@antv/f2-react";
import { Axis, Chart, Interval, Legend, TextGuide, Tooltip, withGuide } from '@antv/f2';
import React from 'react';

const data = [
  { userName: '123', number: 800, type: '次数' },
  { userName: '456', number: 234, type: '次数' },
  { userName: '123', number: 222, type: '类数' },
  { userName: '456', number: 456, type: '类数' },
  { userName: '1223', number: 111, type: '次数' },
  { userName: '4526', number: 234, type: '次数' },
  { userName: '1223', number: 22, type: '类数' },
  { userName: '4526', number: 456, type: '类数' },
];

export default function App() {
  
  let context;
  return (
    <Canvas context={context} pixelRatio={window.devicePixelRatio}>
      <Chart data={data}>
        <Tooltip />
        <Legend
          marker='square'
          style={{
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
          position='top' />
        <Axis field='userName' />
        <Axis field='number' />
        <Interval
          x='userName'
          y='number'
          color='type'
          adjust={{
            type: 'dodge',
            marginRatio: 0, // 设置分组间柱子的间距
          }}
        />
      </Chart>
    </Canvas>

  );
}
