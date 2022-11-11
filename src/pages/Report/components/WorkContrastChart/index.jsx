import React from 'react';
import Canvas from '@antv/f2-react';
import { Chart, Interval, Axis, Tooltip } from '@antv/f2';
import styles from '../../InStockReport/index.less';

const WorkContrastChart = (
    {
      data = [],
      type,
      total,
      getData,
      setType,
      numberText,
      countText,
    },
  ) => {

    return <>
      <div className={styles.workContrasChart}>
        <div className={styles.workContrasChartLabel}>{type === 'ORDER_BY_DETAIL' ? '件' : '次'}</div>
        <div className={styles.workContrastType}>
          <div style={{paddingRight:12}}>总计 {total}</div>
          <div
            onClick={() => {
              getData('ORDER_BY_CREATE_USER');
              setType('ORDER_BY_CREATE_USER');
            }}
            className={type === 'ORDER_BY_CREATE_USER' ? styles.workContrastTypeChecked : ''}
          >
            {countText}
          </div>
          <div
            onClick={() => {
              getData('ORDER_BY_DETAIL');
              setType('ORDER_BY_DETAIL');
            }}
            className={type === 'ORDER_BY_DETAIL' ? styles.workContrastTypeChecked : ''}
          >
            {numberText}
          </div>
        </div>
      </div>
      <Canvas pixelRatio={window.devicePixelRatio} height={150}>
        <Chart data={data}>
          <Tooltip />
          <Axis field='userName' />
          <Axis field='number' />
          <Interval x='userName' y='number' />
        </Chart>
      </Canvas>
    </>;
  }
;

export default WorkContrastChart;
