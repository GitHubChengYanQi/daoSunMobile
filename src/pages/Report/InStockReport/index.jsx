import React, { useState } from 'react';
import DateSelect from '../components/DateSelect';
import TaskReport from '../components/TaskReport';
import styles from './index.less';
import WorkContrast from '../components/WorkContrast';
import SupplyReport from '../components/SupplyReport';
import Ranking from '../components/Ranking';
import Summary from '../components/Summary';
import InStockError from '../components/InStockError';

const InStockReport = () => {

  const [searchParams, setSearchParams] = useState({});

  return <>
    <DateSelect searchParams={searchParams} setSearchParams={setSearchParams} />
    <div style={{ height: 8 }} />
    <TaskReport module='inStock' size={140} gap={10} />
    <div className={styles.space} />
    <Ranking
      title='申请数排行'
      modal='inAskNumber'
      buttons={[
        { title: '任务排行', key: 'inAskNumberTask' },
        { title: '物料排行', key: 'inAskNumberSku' },
      ]} />
    <div style={{ height: 8 }} />
    <WorkContrast module='inStock' />
    <div style={{ height: 8 }} />
    <SupplyReport />
    <div className={styles.space} />
    <Ranking
      title='供应量排行'
      modal='supply'
      buttons={[
        { title: '种类排行', key: 'supplyClass' },
        { title: '数量排行', key: 'supplyNumber' },
      ]} />
    <div style={{ height: 8 }} />
    <Summary date={searchParams.time} module='inStock' />
    <div className={styles.space} />
    <Ranking
      title='入库数量排行'
      modal='inStockNumber'
      buttons={[
        { title: '分类排行', key: 'inStockClass' },
        { title: '类型排行', key: 'inStockType' },
        { title: '仓库排行', key: 'inStockHouse' },
      ]} />
    <div style={{ height: 8 }} />
    <InStockError />
  </>;
};

export default InStockReport;
