import React from 'react';
import { classNames, isArray, ToolUtil } from '../../../components/ToolUtil';
import styles from '../../InStockReport/index.less';
import { RightOutline } from 'antd-mobile-icons';
import Canvas from '@antv/f2-react';
import { Axis, Chart, Interval, Line, TextGuide, Tooltip } from '@antv/f2';

const Summary = (
  {
    date = [],
    module,
  },
) => {

  const data1 = new Array(12).fill('').map((item, index) => ({
    'month': '2022/' + (index + 1),
    'number': parseInt(Math.random() * 10),
    'name': '1',
  }));

  const data2 = new Array(12).fill('').map((item, index) => ({
    'month': '2022/' + (index + 1),
    'number': parseInt(Math.random() * 10),
    'name': '2',
  }));

  let title = '';
  let describe = <></>;
  let charData = [];
  let report = <></>;

  switch (module) {
    case 'inStock':
      charData = [...data1, ...data2];
      title = '物料入库汇总';
      describe = <div>
        <div className={styles.summaryTotalLabel}>
          <span>已入库</span>
          <span><span className='numberBlue'>216</span>类</span>
          <span><span className='numberBlue'>10324</span>件</span>
        </div>
        <div className={styles.summaryTotalLabel}>
          <span>拒绝入库</span>
          <span><span className='numberRed'>216</span>类</span>
          <span><span className='numberRed'>10324</span>件</span>
        </div>
      </div>;
      report = <div className={styles.summaryAllCount}>
        <div className={styles.summaryCount}>
          <div>
            已入库
          </div>
          <div className={styles.summaryCountNumber}>
            <span className='numberBlue' style={{ paddingLeft: 0 }}>216</span>类
            <span className='numberBlue'>216</span>件
          </div>
        </div>
        <div className={styles.summarySpace} />
        <div className={styles.summaryCount}>
          <div>
            拒绝入库
          </div>
          <div className={styles.summaryCountNumber}>
            <span className='numberRed' style={{ paddingLeft: 0 }}>216</span>类
            <span className='numberRed'>216</span>件
          </div>
        </div>
      </div>;
      break;
    case 'outStock':
      charData = data1;
      title = '物料出库汇总';
      describe = <div>
        <div className={styles.summaryTotalLabel}>
          <span>已出库</span>
          <span><span className='numberBlue'>216</span>类</span>
          <span><span className='numberBlue'>10324</span>件</span>
        </div>
      </div>;
      report = <div className={styles.summaryAllCount}>
        <div className={styles.summaryCount}>
          <div>
            <div>
              已出库
            </div>
            <div className={styles.summaryCountNumber}>
              <span className='numberBlue'>216</span>类
              <span className='numberBlue'>216</span>件
            </div>
          </div>
        </div>
      </div>;
      break;
    default:
      break;
  }

  return <div className={classNames(styles.card, styles.summary)}>
    <div className={styles.summaryHeader}>
      <div className={styles.summaryHeaderLabel}>
        {title}
      </div>
      <div>
        <RightOutline />
      </div>
    </div>

    <div hidden={isArray(date).length > 0}>
      <div className={styles.summaryTotal}>
        <div className={styles.summaryTotalUnit}>
          件
        </div>
        {describe}
      </div>

      <Canvas pixelRatio={window.devicePixelRatio} height={120}>
        <Chart data={ToolUtil.isArray(charData)}>
          <Axis
            field='month'
            tickCount={12}
            style={{
              label: {
                rotate: -0.7,
              },
            }}
          />
          <Axis
            field='number'
            tickCount={5}
          />
          <Line x='month' y='number' color={{
            field: 'name',
            range: ['#257BDE', '#FF3131'],
          }} />
          <Tooltip />
        </Chart>
      </Canvas>
    </div>

    {isArray(date).length !== 0 && report}

  </div>;
};

export default Summary;
