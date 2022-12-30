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

  const Guide = withGuide((props) => {
    const { points, style, animation } = props;

    const start = points[0] || {};
    const end = points[1] || {};

    const x = Math.min(start.x, end.x);
    const y = Math.min(start.y, end.y);

    return (
      <group>
        <text
          attrs={{
            x,
            y,
            text: '111/22',
            stroke: 'black',
            strokeOpacity: 0.4,
          }}
        />
        <rect
          attrs={{
            x,
            y,
            width: Math.abs(end.x - start.x),
            height: Math.abs(start.y - end.y),
            ...style,
          }}
          animation={animation}
        />

      </group>
    );
  });
  let context;
  return (
    <Canvas context={context} pixelRatio={window.devicePixelRatio} height={150} width={600}>
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
        <Guide records={[data[0], data[1]]} style={{ fill: '', fillOpacity: 0.2 }} />
      </Chart>
    </Canvas>

  );
}
