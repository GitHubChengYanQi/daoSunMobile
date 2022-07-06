import React from 'react';
import Canvas from '@antv/f2-react';
import { PieLabel, Chart, Interval, Line } from '@antv/f2';

const InventoryRotation = () => {

  const skuClass = [
    { type: '零件', values: [250, 198, 156, 65] },
    { type: '外购件', values: [385, 226, 128, 69] },
    { type: '部件', values: [52, 12, 2, 1] },
    { type: '虚拟件', values: [38, 24, 6, 4] },
    { type: '标件', values: [78, 26, 15, 12] }];

  const date = ['1个月内', '3个月内', '6个月内', '长期呆滞'];

  const data = [];
  // date.forEach((item, index) => {
  //   skuClass.forEach(skuClassItem => {
  //     data.push({ date: item, type: skuClassItem.type, value: skuClassItem.values[index] });
  //   });
  // });
  skuClass.forEach(item=>{
    data.push({name:item.type,y:item.values[0],const: 'const',})
  })

  return  <Canvas  pixelRatio={window.devicePixelRatio}>
    <Chart
      data={data}
      coord={{
        transposed: true,
        type: 'polar',
        radius: 0.75,
      }}
    >
      <Interval
        x="const"
        y="y"
        adjust="stack"
        color={{
          field: 'name',
          range: ['#1890FF', '#13C2C2', '#1c0df3', '#FACC14', '#F04864'],
        }}
      />
      <PieLabel
        sidePadding={10}
        label1={(data, color) => {
          return {
            text: data.name,
            fill: color,
          };
        }}
        label2={(data) => {
          return {
            fill: '#000000',
            text: String(Math.floor(data.y * 100) / 100).replace(/\B(?=(\d{3})+(?!\d))/g, ',')+'类',
            fontWeight: 500,
            fontSize: 10,
          };
        }}
      />
    </Chart>
  </Canvas>
};

export default InventoryRotation;
