import React, { useState } from 'react';
import styles from './index.less';
import { RightOutline } from 'antd-mobile-icons';
import { useHistory } from 'react-router-dom';
import { classNames } from '@/pages/components/ToolUtil';
import App from '@/pages/Report/StockingReport/components/ApplyRanking/App';

const ApplyRanking =()=>{
  const history = useHistory();

  return <div className={classNames(styles.card, styles.summary)}>
    <div className={styles.summaryHeader}>
      <div className={styles.summaryHeaderLabel}>
        排行对比
      </div>
      <div onClick={() => history.push({
        pathname: '/Report/ReportDetail',
        search: 'type=rankingOfInventory',
      })}>
        共 <span className='numberBlue' style={{ fontSize: 18 }}>12</span> 人
        <RightOutline />
      </div>
    </div>
    <App/>

  </div>;
};

export default ApplyRanking;
