import React from 'react';
import { classNames } from '../../../../components/ToolUtil';
import styles from '../../../InStockReport/index.less';
import { RightOutline } from 'antd-mobile-icons';
import Canvas from '@antv/f2-react';
import { Axis, Chart, Interval, Legend, TextGuide, Tooltip } from '@antv/f2';
import { useHistory } from 'react-router-dom';

const Contrast = (
  {},
) => {

  const history = useHistory();

  const data = [
    { userName: '123', number: 111, type: '次数' },
    { userName: '456', number: 234, type: '次数' },
    { userName: '123', number: 22, type: '件数' },
    { userName: '456', number: 456, type: '件数' },
    { userName: '1223', number: 111, type: '次数' },
    { userName: '4526', number: 234, type: '次数' },
    { userName: '1223', number: 22, type: '件数' },
    { userName: '4526', number: 456, type: '件数' },
  ];

  return <div className={classNames(styles.card, styles.summary)}>
    <div className={styles.summaryHeader}>
      <div className={styles.summaryHeaderLabel}>
        排行对比
      </div>
      <div onClick={() => history.push({
        pathname: '/Report/ReportDetail',
        search: 'type=outAskNumber',
      })}>
        共 <span className='numberBlue' style={{ fontSize: 18 }}>12</span> 人
        <RightOutline />
      </div>
    </div>
    <div>
      <Canvas pixelRatio={window.devicePixelRatio} height={150}>
        <Chart data={data}>
          <Tooltip />
          <Legend
            marker='square'
            style={{
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
            position='top' />
          <Axis field='userName' />
          <Axis field='number' />
          <Interval
            x='userName'
            y='number'
            color='type'
            adjust={{
              type: 'dodge',
              marginRatio: 0, // 设置分组间柱子的间距
            }}
          />
        </Chart>
      </Canvas>
    </div>

  </div>;
};

export default Contrast;
