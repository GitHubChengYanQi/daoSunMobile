import React, { useState } from 'react';
import { classNames, ToolUtil } from '../../../../components/ToolUtil';
import styles from '../../../InStockReport/index.less';
import { RightOutline } from 'antd-mobile-icons';
import Canvas from '@antv/f2-react';
import { Axis, Chart, Interval, Legend, Line, Tooltip } from '@antv/f2';
import { useHistory } from 'react-router-dom';
import { Button } from 'antd-mobile';
import ScreenButtons from '../../../InStockReport/components/ScreenButtons';

const Work = (
  { title },
) => {

  const history = useHistory();

  const data = [
    { userName: '123', number: 111, type: '入库' },
    { userName: '123', number: 234, type: '出库' },
    { userName: '123', number: 22, type: '盘点' },
    { userName: '123', number: 456, type: '养护' },
    { userName: '123', number: 456, type: '调拨' },
  ];

  const searchTypes = [
    { text: '执行', type: 'SKU_COUNT' },
    { text: '发起', type: 'NUM_COUNT' },
  ];

  const [type, setType] = useState(searchTypes[0].type);

  return <div className={classNames(styles.card, styles.summary)}>
    <div className={styles.summaryHeader}>
      <div className={styles.summaryHeaderLabel}>
        {title}
      </div>
    </div>
    <div className={styles.rankingHeader}>
      <ScreenButtons onChange={(value) => {

      }} />
      <div className={styles.searchTypes}>
        {
          searchTypes.map((item, index) => {
            return <div
              key={index}
              onClick={() => {
                setType(item.type);
              }}
              className={type === item.type ? styles.searchTypesChecked : ''}
            >
              {item.text}
            </div>;
          })
        }
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
            }}
            position='top' />
          <Axis field='userName' />
          <Axis field='number' />
          <Interval
            x='userName'
            y='number'
            color={{
              field: 'type',
              range: ['#257BDE', '#82B3EA', '#2EAF5D', '#FA8F2B', '#FF3131'],
            }}
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

export default Work;
