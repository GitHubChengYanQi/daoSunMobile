import React from 'react';
import styles from './index.less';
import { RightOutline } from 'antd-mobile-icons';
import { useHistory } from 'react-router-dom';

const ErrorSummary=()=>{

  const history = useHistory()

  return <>
    <div className={styles.inventory}>
      <div className={styles.errorTop}>
        <div className={styles.errorTitle} onClick={()=>{
          history.push({
            pathname: '/Report/ReportDetail',
            search: 'type=inStockArrival',
          });
        }}>异常结果汇总</div>
        <div><RightOutline /></div>
      </div>
      <div className={styles.errorBottom}>
        <div className={styles.details}>
          <div className={styles.blue}>265</div>
          <div className={styles.detailsText}>盘盈数量</div>
        </div>
        <div className={styles.details}>
          <div className={styles.hui}>8216</div>
          <div className={styles.detailsText}>盘亏数量</div>
        </div>
        <div className={styles.details}>
          <div className={styles.cheng}>125</div>
          <div className={styles.detailsText}>其他异常</div>
        </div>
        <div className={styles.details}>
          <div className={styles.red}>89</div>
          <div className={styles.detailsText}>报损数量</div>
        </div>
      </div>
    </div>
  </>
}

export default ErrorSummary;
