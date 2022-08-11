import React from 'react';
import Canvas from '@antv/f2-react';
import { Chart, Axis, Interval, TextGuide } from '@antv/f2';
import { useRequest } from '../../../../util/Request';
import { MyLoading } from '../../../components/MyLoading';
import { PageIndicator, Swiper } from 'antd-mobile';
import { useHistory } from 'react-router-dom';

const spectaculars = { url: '/asynTask/spectaculars', method: 'POST' };

const MaterialAnalysis = (
  {
    noIndicator,
  }) => {

  const history = useHistory();

  const { loading, data } = useRequest(spectaculars);

  const sort = (data) => {
    return data.sort((a, b) => {
      return a.number - b.number;
    });
  };


  const SkuName = (props) => {
    const { coord, name } = props;
    const { bottom, right } = coord;
    return (
      <group>
        <text
          attrs={{
            x: right,
            y: bottom,
            text: name,
            textAlign: 'end',
            textBaseline: 'bottom',
            fontSize: '40px',
            fill: '#ddd',
          }}
        />
      </group>
    );
  };

  if (loading) {
    return <MyLoading skeleton />;
  }

  if (!data) {
    return <></>;
  }

  return <div onClick={() => {
    const pathname = history.location.pathname;
    const url = '/Report/MaterialAnalysisData';
    if (pathname !== url) {
      history.push(url);
    }
  }}>
    <Swiper
      indicator={(total, current) => noIndicator ? null : <PageIndicator style={{justifyContent: 'center'}} total={total} current={current} />}
      loop
      autoplay
      onIndexChange={(index) => {

      }}>
      {
        Object.keys(data).map((item, index) => {
          const options = data[item] || [];
          if (options.length <= 0) {
            return null;
          }
          return <Swiper.Item key={index}>
            <Canvas pixelRatio={window.devicePixelRatio} height={200}>
              <Chart
                key={index}
                data={sort(options) || []}
                coord={{
                  transposed: true,
                }}
              >
                <SkuName name={item} />
                <Axis field='className' style={{
                  line: {
                    opacity: 0,
                  },
                }} />
                <Interval
                  x='className'
                  y='number'
                  color='className'
                />
                {options.map((record) => {
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
            </Canvas>
          </Swiper.Item>;
        })
      }
    </Swiper>
  </div>;
};

export default MaterialAnalysis;
