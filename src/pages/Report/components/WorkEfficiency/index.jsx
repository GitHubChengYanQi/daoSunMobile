import React from 'react';
import Canvas from '@antv/f2-react';
import { Interval, Chart, Axis, Legend } from '@antv/f2';

const WorkEfficiency = () => {

  const users = [
    { type: '张三', values: [423,475,158,88,32] },
    { type: '李四', values: [389,422,246,96,20] },
    { type: '王五', values: [418,362, 260,72,12] },
  ];

  const types = ['入库','出库','盘点','养护','调拨',];

  const data = [];
  types.forEach((item, index) => {
    users.forEach(user => {
      data.push({ name: user.type, year:item , income: user.values[index] ,emoji:user.type});
    });
  });

  return   <Canvas  pixelRatio={window.devicePixelRatio}>
    <Chart
      data={data}
      coord={{
        transposed: true,
      }}
      scale={{
        income: {
          tickCount: 5,
        },
      }}
    >
      <Axis field="name" />
      <Axis field="income" />
      <Interval x="name" y="income" color="year" adjust="stack" />
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
    </Chart>
  </Canvas>
};

export default WorkEfficiency;
