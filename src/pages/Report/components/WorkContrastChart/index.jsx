import React from 'react';
import Canvas from '@antv/f2-react';
import { Chart, Interval, Axis, Tooltip } from '@antv/f2';
import styles from '../../InStockReport/index.less';

const WorkContrastChart = (
    {
      label,
      data = [],
      type,
      total,
      getData,
      setType,
      numberText,
      numberType,
      countText,
      countType,
    },
  ) => {

    return <>
      <div className={styles.workContrasChart}>
        <div className={styles.workContrasChartLabel}>{label}</div>
        <div className={styles.workContrastType}>
          <div style={{ paddingRight: 12 }}>总计 {total}</div>
          <div
            onClick={() => {
              getData(countType);
              setType(countType);
            }}
            className={type === countType ? styles.workContrastTypeChecked : ''}
          >
            {countText}
          </div>
          <div
            onClick={() => {
              getData(numberType);
              setType(numberType);
            }}
            className={type === numberType ? styles.workContrastTypeChecked : ''}
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
