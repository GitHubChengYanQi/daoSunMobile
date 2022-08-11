import Canvas from '@antv/f2-react';
import { Chart, Tooltip, Axis, Line, TextGuide } from '@antv/f2';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useRequest } from '../../../../util/Request';
import { MyLoading } from '../../../components/MyLoading';
import { ToolUtil } from '../../../components/ToolUtil';

export const anomalyCensus = { url: '/anomaly/anomalyCensus', method: 'POST' };

const ErrorSku = (
  {
    year,
  },
) => {

  const history = useHistory();

  const { loading, data, run } = useRequest(anomalyCensus, { manual: true });

  const submit = (year) => {
    run({ data: { beginTime: year } });
  };
  useEffect(() => {
    submit(year);
  }, [year]);

  if (loading) {
    return <MyLoading skeleton />;
  }

  const yearData = ToolUtil.isObject(data);
  const datas = Object.keys(yearData).map(item => ({ date: item, value: yearData[item] }));

  return <div onClick={() => {
    const pathname = history.location.pathname;
    const url = '/Report/SkuErrorData';
    if (pathname !== url) {
      history.push(url);
    }
  }}>
    <Canvas pixelRatio={window.devicePixelRatio} height={200}>
      <Chart data={datas}>
        <Axis
          field='date'
          tickCount={12}
          style={{
            label: { align: 'between' },
          }}
        />
        <Axis field='value' tickCount={5} />
        <Line x='date' y='value' />
        <Tooltip />
        {datas.map((record) => {
          return (
            <TextGuide
              key={record.date}
              records={[record]}
              content={record.value}
              offsetY={-10}
              style={{
                fill: '#EA0000',
                fontSize: '20px',
                textBaseline: 'middle',
                textAlign: 'center',
              }}
            />
          );
        })}
      </Chart>
    </Canvas>
  </div>;
};

export default ErrorSku;
