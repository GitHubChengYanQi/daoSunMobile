import React, { useState } from 'react';
import styles from '../../../InStockReport/index.less';
import LinkButton from '../../../../components/LinkButton';
import { classNames } from '../../../../../util/ToolUtil';
import { RightOutline } from 'antd-mobile-icons';
import { useHistory } from 'react-router-dom';
import { useRequest } from '../../../../../util/Request';
import { MyLoading } from '../../../../components/MyLoading';

export const stockNumberCycle = { url: '/statisticalView/stockNumberCycle', method: 'POST', data: {} };

const CycleStatistics = ({ title }) => {

  const history = useHistory();

  const [status, setStatus] = useState([]);

  const { loading } = useRequest(stockNumberCycle, {
    onSuccess: (res) => {

      const month1 = res['1month'].number || 0;
      const month2 = res['1month-3month'].number || 0;
      const month3 = res['3month-6month'].number || 0;
      const month4 = res['after6month'].number || 0;

      const total = month1 + month2 + month3 + month4;

      setStatus([
        { number: month1, num: Math.round((month1 / total) * 100) || 0, color: '#257BDE', text: '1个月内' },
        { number: month2, num: Math.round((month2 / total) * 100) || 0, color: '#2EAF5D', text: '1-3个月' },
        { number: month3, num: Math.round((month3 / total) * 100) || 0, color: '#FA8F2B', text: '3-6个月' },
        {
          number: month4,
          num: 100 - (Math.round((month1 / total) * 100) || 0) - (Math.round((month2 / total) * 100) || 0) - (Math.round((month3 / total) * 100) || 0),
          color: '#FF3131',
          text: '6个月以上',
        },
      ]);
    },
  });

  if (loading) {
    return <MyLoading skeleton />;
  }

  return <>
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <div onClick={() => {
          history.push({
            pathname: '/Report/ReportDetail',
            search: 'type=stockCycle',
          });
        }}>
          <RightOutline />
        </div>
      </div>
      <div className={styles.taskStatisticsContent} style={{ paddingBottom: 12 }}>
        <div style={{ paddingBottom: 6 }}>
          {status.map((item, index) => {
            return <div
              key={index}
              className={styles.progress}
              style={{ backgroundColor: item.color, width: `${item.num}%` }}
            />;
          })}
        </div>
        <div className={styles.flexCenter} style={{ columnGap: 16, rowGap: 8, flexWrap: 'wrap', fontSize: 12 }}>
          {status.map((item, index) => {
            return <div
              key={index}
              className={styles.flexCenter}
              style={{ width: '45%' }}
            >
              <div style={{ backgroundColor: item.color }} className={styles.circle} />
              {item.text} {item.number}件 ({item.num})%
            </div>;
          })}
        </div>
      </div>
    </div>
  </>;
};

export default CycleStatistics;
