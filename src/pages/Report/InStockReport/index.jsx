import React, { useState } from 'react';
import DateSelect from '../components/DateSelect';
import TaskReport from '../components/TaskReport';
import styles from './index.less';
import WorkContrast from '../components/WorkContrast';
import SupplyReport from '../components/SupplyReport';
import Ranking from '../components/Ranking';
import Summary from '../components/Summary';
import InStockError from '../components/InStockError';
import { isArray } from '../../components/ToolUtil';

const InStockReport = () => {

  const [searchParams, setSearchParams] = useState({});

  return <>
    <DateSelect searchParams={searchParams} setSearchParams={setSearchParams} />
    <div style={{ height: 8 }} />
    <TaskReport
      module='inStock'
      size={140}
      gap={10}
      date={isArray(searchParams.time)}
      searchTypes={[
        {text:'类型', type:'ORDER_TYPE'},
        {text:'状态', type:'ORDER_STATUS'}
      ]}
    />
    <div className={styles.space} />
    <Ranking
      askNumber
      date={isArray(searchParams.time)}
      title='申请数排行'
      module='inAskNumber'
      buttons={[
        { title: '任务排行', key: 'ORDER_BY_CREATE_USER' },
        { title: '物料排行', key: 'ORDER_BY_DETAIL' },
      ]}
    />
    <div style={{ height: 8 }} />
    <WorkContrast module='inStock' />
    <div style={{ height: 8 }} />
    <SupplyReport date={searchParams.time} />
    <div className={styles.space} />
    <Ranking
      noExtra
      title='供应量排行'
      module='supply'
      buttons={[
        { title: '种类排行', key: 'SKU_COUNT' },
        { title: '数量排行', key: 'NUM_COUNT' },
      ]} />
    <div style={{ height: 8 }} />
    <Summary date={searchParams.time} module='inStock' />
    <div className={styles.space} />
    <Ranking
      title='入库数量排行'
      module='inStockNumber'
      buttons={[
        { title: '分类排行', key: 'SPU_CLASS' },
        { title: '类型排行', key: 'TYPE' },
        { title: '仓库排行', key: 'STOREHOUSE' },
      ]} />
    <div style={{ height: 8 }} />
    <InStockError date={searchParams.time} />
  </>;
};

export default InStockReport;
