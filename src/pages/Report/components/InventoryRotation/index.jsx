import React from 'react';
import Canvas from '@antv/f2-react';
import { Chart, Interval,  Axis, Legend } from '@antv/f2';

const InventoryRotation = () => {

  const skuClass = [
    { name: '零件', values: [250, 198, 156, 65] },
    { name: '外购件', values: [385, 226, 128, 69] },
    { name: '部件', values: [52, 12, 2, 1] },
    { name: '虚拟件', values: [38, 24, 6, 4] },
    { name: '标件', values: [78, 26, 15, 12] }];

  const date = ['1个月内', '3个月内', '6个月内', '长期呆滞'];

  const data = [];
  skuClass.forEach(typeItem => {
    date.forEach((item, index) => {
      data.push({ name:typeItem.name , month: item, value: typeItem.values[index] });
    });
  });

  return <Canvas pixelRatio={window.devicePixelRatio}>
    <Chart data={data}>
      <Axis field='name' />
      <Axis field='value' />
      <Legend
        position='top'
        style={{
          justifyContent: 'space-around',
        }}
        triggerMap={{
          press: (items, records, legend) => {
            const map = {};
            items.forEach((item) => (map[item.month] = this.clone(item)));
            records.forEach((record) => {
              map[record.type].value = record.value;
            });
            legend.setItems(this.values(map));
          },
          pressend: (items, records, legend) => {
            legend.setItems(items);
          },
        }}
      />
      <Interval
        x='name'
        y='value'
        color='month'
        adjust={{
          type: 'dodge',
          marginRatio: 0.05, // 设置分组间柱子的间距
        }}
      />
    </Chart>
  </Canvas>;
};

export default InventoryRotation;
