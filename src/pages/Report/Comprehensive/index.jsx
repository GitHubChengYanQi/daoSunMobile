import React from 'react';
import StockStatistics from './components/StockStatistics';
import NumberRanking from './components/NumberRanking';
import CycleStatistics from './components/CycleStatistics';
import LackRanking from './components/LackRanking';
import TaskStatistics from './components/TaskStatistics';
import Work from './components/Work';
import Ranking from './components/Ranking';
import { isArray } from '../../components/ToolUtil';
import styles from '../index.less';

const Comprehensive = ({ layout }) => {

  const table = isArray(layout?.steps)[0]?.data || [];

  return table.map((item, index) => {
    const rows = item[0]?.data || [];
    const childrens = rows.map((item, index) => {
      switch (item.key) {
        case 'StockStatistics':
          return <div key={index}>
            <StockStatistics title={item.filedName} />
            <NumberRanking />
          </div>;
        case 'CycleStatistics':
          return <div key={index}>
            <CycleStatistics title={item.filedName} />
          </div>;
        case 'LackRanking':
          return <LackRanking title={item.filedName} key={index} />;
        case 'TaskStatistics':
          return <div key={index}>
            <TaskStatistics title={item.filedName} />
          </div>;
        case 'Work':
          return <div key={index}>
            <Work title={item.filedName} />
            <Ranking />
          </div>;
      }
    });
    return <div key={index}>
      <div className={styles.card}>
        {childrens}
      </div>
      <div style={{ height: 8 }} />
    </div>;
  });
};

export default Comprehensive;
