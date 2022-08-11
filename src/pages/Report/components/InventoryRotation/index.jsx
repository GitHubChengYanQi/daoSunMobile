import React from 'react';
import Canvas from '@antv/f2-react';
import { Chart, Interval, PieLabel } from '@antv/f2';
import { useHistory } from 'react-router-dom';

const InventoryRotation = () => {

  const history = useHistory();

  const data = [
    { name: '长期呆滞', number: 78, const: 'const',  },
    { name: '六个月内', number: 353, const: 'const',  },
    { name: '三个月内', number: 1213, const: 'const',  },
    { name: '一个月内', number: 234, const: 'const',  },
  ];

  return <div  onClick={() => {
    history.push('/Report/DaysInStock');
  }}>
    <Canvas pixelRatio={window.devicePixelRatio} height={200}>
      <Chart
        data={data}
        coord={{
          type: 'polar',
          transposed: true,
          innerRadius: 0.5,
          radius: 0.6,
        }}
        scale={{}}
      >
        <Interval
          x="const"
          y="number"
          adjust="stack"
          color={{
            field: 'name',
            range: [
              '#1890FF',
              '#13C2C2',
              '#2FC25B',
              '#FACC14',
            ],
          }}
        />
        <PieLabel
          label1={(data) => {
            return {
              text: data.name,
              fill: '#808080',
            };
          }}
          label2={(data) => {
            return {
              fill: '#000000',
              text: data.number.toFixed(2),
              fontWeight: 500,
              fontSize: 10,
            };
          }}
          onClick={(data) => {
            console.log(data);
          }}
        />
      </Chart>
    </Canvas>
  </div>;
};

export default InventoryRotation;
