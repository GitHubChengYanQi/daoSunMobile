import React from 'react';
import TaskReport from '../components/TaskReport';
import styles from '../InStockReport/index.less';
import Ranking from '../components/Ranking';
import Inventory from '../components/Inventory';

const Comprehensive = () => {


  return <>
    <TaskReport
      title='库存统计'
      module='stockReport'
      size={100}
      gap={6}
      searchTypes={[
        { text: '状态', type: 'ORDER_STATUS' },
        { text: '分类', type: 'ORDER_TYPE' },
      ]}
    />
    <div className={styles.space} />
    <Ranking
      title='库存数量排行'
      modal='stockNumber'
      buttons={[
        { title: '分类排行', key: '0' },
        { title: '仓库排行', key: '1' },
        { title: '材质排行', key: '2' },
        { title: '供应商排行', key: '3' },
      ]}
    />
    <div style={{ height: 8 }} />
    <Inventory />
    <div style={{ height: 8 }} />
    <TaskReport
      title='任务统计（近一年）'
      module='comprehensive'
      size={100}
      gap={6}
      searchTypes={[
        { text: '类型', type: 'ORDER_TYPE' },
        { text: '状态', type: 'ORDER_STATUS' },
      ]}
    />
  </>;
};

export default Comprehensive;
