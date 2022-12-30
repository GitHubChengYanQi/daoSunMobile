import React from 'react';
import styles from '../../../InStockReport/index.less';
import LinkButton from '../../../../components/LinkButton';
import { classNames } from '../../../../../util/ToolUtil';
import { useHistory } from 'react-router-dom';

const StockStatistics = ({title}) => {

  const history = useHistory();

  const status = [
    { num: 92, color: '#257BDE', text: '正常' },
    { num: 8, color: '#FF3131', text: '异常' },
  ];

  return <>
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
      </div>
      <div style={{ textAlign: 'right', padding: 8 }}>
        库存总数 <span className='numberBlue'>432</span>类 <span className='numberBlue'>15700</span>件
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
        <div className={styles.flexCenter}>
          <div
            className={classNames(styles.flexCenter, styles.flexGrow)}
            style={{ gap: 8, flexWrap: 'wrap', fontSize: 12 }}
          >
            {status.map((item, index) => {
              return <div
                key={index}
                className={styles.flexCenter}
              >
                <div style={{ backgroundColor: item.color }} className={styles.circle} />
                {item.text} 666类 666件 (666)%
              </div>;
            })}
          </div>
          <LinkButton style={{ fontSize: 12, minHeight: 24 }} onClick={() => {
            history.push({
              pathname: '/Report/ReportDetail',
              search: 'type=errorSkus',
            });
          }}>详情</LinkButton>
        </div>
      </div>
    </div>
  </>;
};

export default StockStatistics;
