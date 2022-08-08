import React from 'react';
import Canvas from '@antv/f2-react';
import { Chart, Timeline, Axis, Interval, TextGuide } from '@antv/f2';
import { useRequest } from '../../../../util/Request';
import { MyLoading } from '../../../components/MyLoading';
import MyEmpty from '../../../components/MyEmpty';

const spectaculars = { url: '/asynTask/spectaculars', method: 'POST' };

const MaterialAnalysis = () => {

  const { loading, data } = useRequest(spectaculars);

  const sort = (data) => {
    return data.sort((a, b) => {
      return a.number - b.number;
    });
  };

  const dataSort = (data) => {
    const newData = [];
    newData.push(Object.keys(data)[0]);
    return newData;
  };

  function Year(props) {
    const { coord, year } = props;
    const { bottom, right } = coord;
    return (
      <group>
        <text
          attrs={{
            x: right,
            y: bottom,
            text: year,
            textAlign: 'end',
            textBaseline: 'bottom',
            fontSize: '40px',
            fill: '#ddd',
          }}
        />
      </group>
    );
  }

  if (loading) {
    return <MyLoading skeleton />;
  }

  if (!data) {
    return <MyEmpty />;
  }

  return <Canvas pixelRatio={window.devicePixelRatio} height={200}>
    <Timeline delay={10}>
      {dataSort(data).map((year, index) => {
        return (
          <Chart
            key={index}
            data={sort(data[year]) || []}
            coord={{
              transposed: true,
            }}
          >
            <Year year={year} />
            <Axis field='className' />
            <Axis
              field='number'
              style={{
                label: {
                  align: 'between',
                },
              }}
            />
            <Interval
              x='className'
              y='number'
              color='className'
              animation={{
                appear: {
                  easing: 'linear',
                  duration: 0,
                  property: ['width'],
                  start: {
                    width: 0,
                  },
                },
                update: {
                  easing: 'linear',
                  duration: 0,
                  delay: 0,
                  property: ['width'],
                  start: {
                    width: 0,
                  },
                },
              }}
            />
            {data[year].map((record) => {
              return (
                <TextGuide
                  key={record.className}
                  records={[record]}
                  content={record.number}
                  offsetX={4}
                  style={{
                    fill: '#666',
                    fontSize: '20px',
                    textBaseline: 'middle',
                  }}
                />
              );
            })}
          </Chart>
        );
      })}
    </Timeline>
  </Canvas>;
};

export default MaterialAnalysis;
