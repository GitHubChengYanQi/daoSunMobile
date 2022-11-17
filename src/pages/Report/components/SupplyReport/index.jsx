import React, { useEffect } from 'react';
import styles from '../../InStockReport/index.less';
import { RightOutline } from 'antd-mobile-icons';
import { classNames } from '../../../components/ToolUtil';
import Icon from '../../../components/Icon';
import { useRequest } from '../../../../util/Request';
import { MyLoading } from '../../../components/MyLoading';

const viewTotail = { url: '/statisticalView/viewTotail', method: 'POST' };

const SupplyReport = (
  {
    date = [],
  },
) => {

  const { loading, data = {}, run } = useRequest(viewTotail, { manual: true });

  useEffect(() => {
    run({ data: { beginTime: date[0], endTime: date[1] } });
  }, [date[0], date[1]]);

  if (loading) {
    return <MyLoading skeleton />;
  }

  return <div className={classNames(styles.card, styles.supplyReport)}>
    <div className={styles.supplyHeader}>
      <div className={styles.supplyHeaderLabel}>
        供应量统计
      </div>
      <div>
        共 <span className='numberBlue'>{data.customerCount || 0}</span>家 <RightOutline />
      </div>
    </div>
    <div className={styles.supplyContent}>
      <div className={styles.supplyContentItem}>
        <div className={styles.supplyContentLabel}>到货</div>
        <div className={styles.supplyContentValue}>
          <span>{data.detailSkuCount || 0}</span>类
          <span>{data.detailNumberCount || 0}</span>件
        </div>
      </div>
      <div className={styles.supplyContentItem}>
        <div className={styles.supplyContentLabel}>已入库</div>
        <div className={styles.supplyContentValue}>
          <span className='blue'>{data.logNumberCount || 0}</span>类
          <span className='blue'>{data.logSkuCount || 0}</span>件
        </div>
      </div>
      <div className={styles.supplyContentItem}>
        <div className={styles.supplyContentLabel}>拒绝入库</div>
        <div className={styles.supplyContentValue}>
          <span className='red'>{data.errorNumberCount || 0}</span>类
          <span className='red'>{data.errorSkuCount || 0}</span>件
        </div>
      </div>
    </div>
  </div>;
};

export default SupplyReport;
