import Canvas from '@antv/f2-react';
import { Chart, Interval } from '@antv/f2';
import React from 'react';
import style from '../../StatisticalChart/index.less';
import { useHistory } from 'react-router-dom';
import { useRequest } from '../../../../util/Request';
import { MyLoading } from '../../../components/MyLoading';
import MyEmpty from '../../../components/MyEmpty';
import { ToolUtil } from '../../../components/ToolUtil';

export const stockCensus = { url: '/stockDetails/stockCensus', method: 'GET' };

const Stock = () => {

  const history = useHistory();

  const { loading, data: stockData } = useRequest(stockCensus);

  const data = ToolUtil.isArray(stockData).filter(item => !['skuNumber', 'stockCount'].includes(item.name));

  if (loading) {
    return <MyLoading skeleton />;
  }

  if (!data) {
    return <MyEmpty />;
  }

  const getData = (name) => {
    const data = stockData.filter(item => item.name === name);
    return data[0] || {};
  };

  const normalPercent = parseInt((getData('normal').number / getData('stockCount').number) * 100);

  return <div className={style.flexCenter} onClick={() => {
    history.push('/Report/StockData');
  }}>
    <div className={style.flexGap}>
      <div style={{ fontSize: 14 }}>全部库存
        <span className='numberBlue' style={{ fontSize: 16 }}>{getData('skuNumber').number}</span>类
        <span className='numberBlue' style={{ fontSize: 16 }}>{getData('stockCount').number}</span> 件
      </div>
      <div>
        <span style={{ backgroundColor: '#257BDE' }} className={style.dian} />
        正常 <span className='numberBlue'>{getData('normal').typeNum}</span>类
        <span className='numberBlue'>{getData('normal').number}</span> 件
        ({normalPercent}%)
      </div>
      <div>
        <span style={{ backgroundColor: '#FA5151' }} className={style.dian} />
        异常 <span className='numberBlue'>{getData('error').typeNum}</span>类
        <span className='numberBlue'>{getData('error').number}</span> 件
        ({100 - normalPercent}%)
      </div>
    </div>
    <Canvas pixelRatio={window.devicePixelRatio} width={150} height={150}>
      <Chart
        scale={{
          percent: {
            formatter: function formatter(val) {
              return val + '%';
            },
          },
        }}
        data={data}
        coord={{
          type: 'polar',
          transposed: true,
          innerRadius: 0.7,
          radius: 0.85,
        }}
      >
        <Interval
          x='a'
          y='number'
          adjust='stack'
          color={{
            field: 'name',
            range: ['#257BDE', '#FA5151'],
          }}
        />
      </Chart>
    </Canvas>
  </div>;

};

export default Stock;
