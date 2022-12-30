import Canvas from "@antv/f2-react";
import { Axis, Chart, Interval, Legend, Line, TextGuide } from '@antv/f2';
import React from 'react';

const data=[
  {
    "date": "1月",
    "type": "数量差异",
    "value": 99.9
  },
  {
    "date": "1月",
    "type": "其他差异",
    "value": 96.6
  },
  {
    "date": "2月",
    "type": "数量差异",
    "value": 96.7
  },
  {
    "date": "2月",
    "type": "其他差异",
    "value": 91.1
  },

  {
    "date": "3月",
    "type": "数量差异",
    "value": 100.2
  },
  {
    "date": "3月",
    "type": "其他差异",
    "value": 99.4
  },

  {
    "date": "4月",
    "type": "数量差异",
    "value": 104.7
  },
  {
    "date": "4月",
    "type": "其他差异",
    "value": 108.1
  },

  {
    "date": "5月",
    "type": "数量差异",
    "value": 95.6
  },
  {
    "date": "5月",
    "type": "其他差异",
    "value": 96
  },

  {
    "date": "6月",
    "type": "数量差异",
    "value": 95.6
  },
  {
    "date": "6月",
    "type": "其他差异",
    "value": 89.1
  },

  {
    "date": "7月",
    "type": "数量差异",
    "value": 95.3
  },
  {
    "date": "7月",
    "type": "其他差异",
    "value": 89.2
  },

  {
    "date": "8月",
    "type": "数量差异",
    "value": 96.1
  },
  {
    "date": "8月",
    "type": "其他差异",
    "value": 97.6
  },
]
export default function ErrorApp() {

  let context;
  return (

    <Canvas context={context} pixelRatio={window.devicePixelRatio} height={200}>
      <Chart data={data}>
        {/*<Legend*/}
        {/*  marker='square'*/}
        {/*  style={{*/}
        {/*    alignItems: 'center',*/}
        {/*    justifyContent: 'flex-end',*/}
        {/*  }}*/}
        {/*  position='top' />*/}

        <Axis field="value"/>
        <Axis field='date' />
        <Line x="date" y="value" color={{
          field: 'type',
          range: ['#257BDE', '#FF3131'],
        }}  />

      </Chart>
    </Canvas>

  );
}
