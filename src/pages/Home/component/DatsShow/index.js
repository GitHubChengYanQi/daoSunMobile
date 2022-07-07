import React from 'react';
import { Chart, Interval } from '@antv/f2';
import Canvas from '@antv/f2-react'

const DataShow = () => {
  const data = [
    {
      name: '长津湖',
      percent: 7256.36,
      a: '1',
    },
    {
      name: '我和我的父辈',
      percent: 3536.66,
      a: '1',
    },
    {
      name: '失控玩家',
      percent: 5000.00,
      a: '1',
    },
    {
      name: '宝可梦',
      percent: 8565.78,
      a: '1',
    },
  ];


  return (
    <>
      <Canvas pixelRatio={window.devicePixelRatio} width={250}>
        <Chart
          data={data}
          coord={{
            transposed: true,
            type: 'polar',
          }}
        >
          <Interval
            x="a"
            y="percent"
            adjust="stack"
            color={{
              field: 'name',
              range: ['#F04864','#1890FF', '#2FC25B', '#FACC14', ],
            }}
          />
        </Chart>
      </Canvas>
    </>
  );
};

export default DataShow;
