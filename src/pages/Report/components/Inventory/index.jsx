import React from 'react';
import InventoryRotation from '../InventoryRotation';
import { classNames } from '../../../../util/ToolUtil';
import styles from '../../InStockReport/index.less';
import { RightOutline } from 'antd-mobile-icons';

const Inventory = () => {


  return <div className={classNames(styles.card, styles.taskReport)}>
    <div className={styles.taskReportHeader}>
      <div className={styles.taskReportLabel}>库存统计</div>
      <div className={styles.taskReportType}><RightOutline /></div>
    </div>
    <InventoryRotation />
  </div>;
};

export default Inventory;
