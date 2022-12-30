import React from 'react';
import CountStatistics from '@/pages/Report/StockingReport/components/CountStatistics';
import ErrorException from '@/pages/Report/StockingReport/components/ErrorException';
import CountTimes from '@/pages/Report/StockingReport/components/CountTimes';
import ErrorSummary from '@/pages/Report/StockingReport/components/ErrorSummary';
import ApplyRanking from '@/pages/Report/StockingReport/components/ApplyRanking';
import { isArray } from '@/pages/components/ToolUtil';
import styles from '@/pages/Report/index.less';
import TaskStatistics from '@/pages/Report/StockingReport/components/TaskStatistics';

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
