import React from 'react';
import styles from '../../InStockReport/index.less';
import { RightOutline } from 'antd-mobile-icons';
import { classNames } from '../../../components/ToolUtil';
import Icon from '../../../components/Icon';

const SupplyReport = () => {


  return <div className={classNames(styles.card, styles.supplyReport)}>
    <div className={styles.supplyHeader}>
      <div className={styles.supplyHeaderLabel}>
        供应量统计
      </div>
      <div>
        共 <span className='numberBlue'>108</span>家供货商 <RightOutline />
      </div>
    </div>
    <div className={styles.supplyContent}>
      <div className={styles.supplyContentItem}>
        <div className={styles.supplyContentLabel}>送货</div>
        <div className={styles.supplyContentValue}>
          <span>65</span>类
          <span>880</span>件
        </div>
      </div>
      <div className={styles.supplyContentItem}>
        <div className={styles.supplyContentLabel}>已入库</div>
        <div className={styles.supplyContentValue}>
          <span className='blue'>65</span>类
          <span className='blue'>880</span>件
        </div>
      </div>
      <div className={styles.supplyContentItem}>
        <div className={styles.supplyContentLabel}>拒绝入库</div>
        <div className={styles.supplyContentValue}>
          <span className='red'>65</span>类
          <span className='red'>880</span>件
        </div>
      </div>
    </div>
  </div>;
};

export default SupplyReport;
