import React from 'react';
import { isArray } from '../../../util/ToolUtil';
import styles from '../../index.less';
import ErrorSummary from './components/ErrorSummary';
import TaskStatistics from './components/TaskStatistics';
import ApplyRanking from './components/ApplyRanking';
import CountTimes from './components/CountTimes';
import ErrorException from './components/ErrorException';
import CountStatistics from './components/CountStatistics';

const StockingReport = ({ layout = {} }) => {
  const table = isArray(layout?.steps)[0]?.data || [];

  return table.map((item, index) => {
    const rows = item[0]?.data || [];
    const childrens = rows.map((item, index) => {
      switch (item.key) {
        case 'CountStatistics':
          return <div key={index}>
            <CountStatistics title={item.filedName} />
            <CountTimes />
          </div>;
        case 'ErrorException':
          return <ErrorException title={item.filedName} key={index} />;
        case 'ErrorSummary':
          return <ErrorSummary title={item.filedName} key={index} />;
        case 'TaskStatistics':
          return <div key={index}>
            <TaskStatistics title={item.filedName} />
            <ApplyRanking />
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
}

export default StockingReport;
