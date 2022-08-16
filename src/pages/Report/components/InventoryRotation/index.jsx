import React, { useState } from 'react';
import Canvas from '@antv/f2-react';
import { Chart, Interval, PieLabel } from '@antv/f2';
import { useHistory } from 'react-router-dom';
import { useRequest } from '../../../../util/Request';
import { MyLoading } from '../../../components/MyLoading';
import MyEmpty from '../../../components/MyEmpty';

export const stockSpectaculars = { url: '/asynTask/stockSpectaculars', method: 'POST' };

const InventoryRotation = (
  {
    onChange = () => {
    },
    height,
  },
) => {

  const history = useHistory();

  const [data, setData] = useState([]);

  const { loading } = useRequest(stockSpectaculars, {
    onSuccess: (res) => {
      onChange(res || []);
      const datas = res || [];
      const times = ['长期呆滞', '6个月内', '3个月内', '1个月内'];
      const newData = [];
      times.forEach(month => {
        const values = datas.filter(item => item.month === month);
        let number = 0;
        values.forEach(item => number += item.value);
        newData.push({ month, number, const: 'const' });
      });
      setData(newData);
    },
  });
  if (loading) {
    return <MyLoading skeleton />;
  }

  if (data.length === 0) {
    return <MyEmpty />;
  }

  let total = 0;
  data.forEach(item => total += item.number);

  return <div onClick={() => {
    const pathname = history.location.pathname;
    const url = '/Report/DaysInStock';
    if (pathname !== url) {
      history.push(url);
    }
  }}>
    <Canvas pixelRatio={window.devicePixelRatio} height={height || 200}>
      <Chart
        data={data}
        coord={{
          type: 'polar',
          transposed: true,
          innerRadius: 0.5,
          radius: 0.7,
        }}
        scale={{}}
      >
        <Interval
          x='const'
          y='number'
          adjust='stack'
          color={{
            field: 'month',
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
              text: data.month,
              fill: '#808080',
            };
          }}
          label2={(data) => {
            return {
              fill: '#000000',
              text: `${data.number || 0}件 (${parseInt((data.number / total) * 100)}%)`,
              fontWeight: 500,
              fontSize: 10,
            };
          }}
        />
      </Chart>
    </Canvas>
  </div>;
};

export default InventoryRotation;
