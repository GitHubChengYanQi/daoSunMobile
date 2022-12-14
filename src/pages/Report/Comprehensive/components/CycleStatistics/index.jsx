import React from 'react';
import styles from '../../../InStockReport/index.less';
import LinkButton from '../../../../components/LinkButton';
import { classNames } from '../../../../components/ToolUtil';
import { RightOutline } from 'antd-mobile-icons';

const CycleStatistics = () => {


  const status = [
    { num: 92, color: '#257BDE', text: '1个月内' },
    { num: 2, color: '#2EAF5D', text: '1-3个月' },
    { num: 2, color: '#FA8F2B', text: '3-6个月' },
    { num: 4, color: '#FF3131', text: '6个月以上' },
  ];

  return <>
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>库存周期占比</div>
        <div onClick={() => {
          history.push({
            pathname: '/Report/ReportDetail',
            search: 'type=inStockArrival',
          });
        }}>
          <RightOutline />
        </div>
      </div>
      <div className={styles.taskStatisticsContent} style={{ paddingBottom: 12 }}>
        <div>
          {status.map((item, index) => {
            return <div
              key={index}
              className={styles.progress}
              style={{ backgroundColor: item.color, width: `${item.num}%` }}
            />;
          })}
        </div>
        <div className={styles.flexCenter} style={{  columnGap: 16, rowGap: 8, flexWrap: 'wrap', fontSize: 12 }}>
          {status.map((item, index) => {
            return <div
              key={index}
              className={styles.flexCenter}
            >
              <div style={{ backgroundColor: item.color }} className={styles.circle} />
              {item.text} 157件 (98)%
            </div>;
          })}
        </div>
      </div>
    </div>
  </>;
};

export default CycleStatistics;
