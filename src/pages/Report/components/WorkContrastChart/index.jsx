import React from 'react';
import Canvas from '@antv/f2-react';
import { Chart, Interval, Axis } from '@antv/f2';

const WorkContrastChart = (
  {
    data = [],
  },
) => {

  return <>
    <div style={{ fontSize: 12, padding: '0 24px', marginTop: 8 }}>件 <span style={{ float: 'right' }}>总计 789</span>
    </div>
    <Canvas pixelRatio={window.devicePixelRatio} height={150}>
      <Chart data={data}>
        <Axis field='genre' />
        <Axis field='sold' />
        <Interval x='genre' y='sold' />
      </Chart>
    </Canvas>
  </>;
};

export default WorkContrastChart;
