import Canvas from '@antv/f2-react';
import { Chart, Interval, Axis, Legend } from '@antv/f2';
import React from 'react';

const ErrorSku = () => {

  const types = [{ type: '入库', values: [21, 42, 13, 34, 15, 22] }, { type: '盘点', values: [12, 32, 51, 56, 14, 23] }];

  const months = ['1月', '2月', '3月', '4月', '5月', '6月'];

  const data = [];
  types.forEach(typeItem => {
    months.forEach((item, index) => {
      data.push({ date: item, name: typeItem.type, value: typeItem.values[index] });
    });
  });

  return <Canvas pixelRatio={window.devicePixelRatio}>
    <Chart data={data}>
      <Axis field='date' />
      <Axis field='value' />
      <Legend
        position='top'
        style={{
          justifyContent: 'space-around',
        }}
        triggerMap={{
          press: (items, records, legend) => {
            const map = {};
            items.forEach((item) => (map[item.name] = this.clone(item)));
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
        x='date'
        y='value'
        color='name'
        adjust={{
          type: 'dodge',
          marginRatio: 0.05, // 设置分组间柱子的间距
        }}
      />
    </Chart>
  </Canvas>;
};

export default ErrorSku;
