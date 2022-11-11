import React, { useEffect } from 'react';
import styles from '../../InStockReport/index.less';
import { classNames } from '../../../components/ToolUtil';
import { Chart, Interval } from '@antv/f2';
import Canvas from '@antv/f2-react';
import { useRequest } from '../../../../util/Request';

const errorBySpuClass = { url: '/statisticalView/errorBySpuClass', method: 'POST' };

const InStockError = ({ date = [] }) => {

  const { loading, data: list = {}, run } = useRequest(errorBySpuClass, {
    manual: true,
  });

  // console.log(list);
  useEffect(() => {
    run({ data: { beginTime: date[0], endTime: date[1] } });
  }, [date[0], date[1]]);


  const data = [
    {
      name: '1',
      percent: 10,
      a: '1',
    },
    {
      name: '2',
      percent: 20,
      a: '1',
    },
    {
      name: '3',
      percent: 30,
      a: '1',
    },
    {
      name: '4',
      percent: 30,
      a: '1',
    },
  ];

  return <div className={classNames(styles.card, styles.inStockError)}>
    <div className={styles.title}>异常入库数占比</div>

    <div className={styles.inStockErrorChart}>
      <Canvas pixelRatio={window.devicePixelRatio} width={150} height={150}>
        <Chart
          data={data}
          coord={{
            transposed: true,
            type: 'polar',
            radius: 1.2,
          }}
        >
          <Interval
            x='a'
            y='percent'
            adjust='stack'
            color={{
              field: 'name',
              range: ['#257BDE', '#2EAF5D', '#FA8F2B', '#FF3131'],
            }}
          />
        </Chart>
      </Canvas>
      <div className={styles.inStockErrorDescribe}>
        <div>
          <span className={styles.inStockErrorTotalLabel}>总计</span>
          <span className='numberBlue' style={{ fontSize: 16 }}>160</span>类
          <span className='numberBlue' style={{ fontSize: 16 }}>160</span>件
        </div>
        <div className={styles.inStockErrorChartTypes}>
          <div className={styles.inStockErrorChartType}>
            <span style={{ backgroundColor: '#257BDE' }} className={styles.dian} />
            物料采购
            <span>120 类  88 件 (25%)</span>
          </div>
          <div className={styles.inStockErrorChartType}>
            <span style={{ backgroundColor: '#2EAF5D' }} className={styles.dian} />
            生产完工
            <span>120 类  88 件 (25%)</span>
          </div>
          <div className={styles.inStockErrorChartType}>
            <span style={{ backgroundColor: '#FA8F2B' }} className={styles.dian} />
            生产退料
            <span>120 类  88 件 (25%)</span>
          </div>
          <div className={styles.inStockErrorChartType}>
            <span style={{ backgroundColor: '#FF3131' }} className={styles.dian} />
            客户退货
            <span>120 类  88 件 (25%)</span>
          </div>
        </div>
      </div>
    </div>
  </div>;
};

export default InStockError;
