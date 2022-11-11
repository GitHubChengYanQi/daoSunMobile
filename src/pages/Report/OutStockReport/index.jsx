import React, { useState } from 'react';
import DateSelect from '../components/DateSelect';
import TaskReport from '../components/TaskReport';
import styles from './index.less';
import WorkContrast from '../components/WorkContrast';
import Ranking from '../components/Ranking';
import Summary from '../components/Summary';


const OutStockReport = () => {

  const [searchParams, setSearchParams] = useState({});

  return <>
    <DateSelect searchParams={searchParams} setSearchParams={setSearchParams} />
    <div style={{ height: 8 }} />
    <TaskReport module='outStock' size={140} date={searchParams.time} />
    <div className={styles.space} />
    <Ranking
      title='申请数排行'
      modal='outAskNumber'
      buttons={[
        { title: '任务排行', key: 'ORDER_BY_CREATE_USER' },
        { title: '物料排行', key: 'ORDER_BY_DETAIL' },
      ]} />
    <div style={{ height: 8 }} />
    <WorkContrast module='outStock' />
    <div style={{ height: 8 }} />
    <Summary date={searchParams.time} module='outStock' />
    <div className={styles.space} />
    <Ranking
      title='出库数量排行'
      modal='outStockNumber'
      buttons={[
        { title: '分类排行', key: 'outStockClass' },
        { title: '类型排行', key: 'outStockType' },
        { title: '仓库排行', key: 'outStockHouse' },
        { title: '领料人排行', key: 'outStockUser' },
      ]} />
    <div style={{ height: 8 }} />
    <Ranking
      noIcon
      fontSize={16}
      title='使用量排行'
      modal='useNumber'
      buttons={[
        { title: '种类排行', key: 'useClass' },
        { title: '数量排行', key: 'useNumber' },
      ]} />
  </>;
};

export default OutStockReport;
