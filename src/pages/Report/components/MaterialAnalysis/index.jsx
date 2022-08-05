import React from 'react';
import Canvas from '@antv/f2-react';
import { Chart, Timeline, Axis, Interval, TextGuide } from '@antv/f2';

const MaterialAnalysis = () => {


  const skuClass = [
    { name: '零件', values: [10, 8, 6, 6, 8, 6, 4, 8, 6] },
    { name: '外购件', values: [12, 11, 12, 10, 11, 12, 10, 11, 12] },
    { name: '部件', values: [4, 2, 4, 4, 2, 4, 4, 2, 4] },
    { name: '虚拟件', values: [5, 2, 8, 5, 2, 8, 5, 2, 8] },
    { name: '标件', values: [10, 10, 10, 10, 10, 10, 10, 10, 10] },
  ];

  const skus = ['T510-A8','物料名称']

  const data ={};

  skus.forEach((item,index)=>{
    data[item] = skuClass.map(item => {
      return {
        'number': item.values[index],
        'name': item.name,
      };
    })
  })

  // console.log(data);


  function sort(data) {
    return data.sort((a, b) => {
      return a.income - b.income;
    });
  }

  function Year(props) {
    const { coord } = props;
    const { bottom, right } = coord;
    return (
      <group>
        <text
          attrs={{
            x: right,
            y: bottom,
            textAlign: 'end',
            textBaseline: 'bottom',
            fontSize: '40px',
            // fontWeight: 'bold',
            fill: '#ddd',
          }}
        />
      </group>
    );
  }


  return <Canvas pixelRatio={window.devicePixelRatio} height={200}>
    <Timeline delay={10}>
      {Object.keys(data).map((year, index) => {
        return (
          <Chart
            key={index}
            data={sort(data[year])}
            coord={{
              transposed: true,
            }}
          >
            <Year year={year} />
            <Axis field='name' />
            <Axis
              field='number'
              style={{
                label: {
                  align: 'between',
                },
              }}
            />
            <Interval
              x='name'
              y='number'
              color='name'
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
                  key={record.name}
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
