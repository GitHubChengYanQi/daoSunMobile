import React from 'react';
import Arrival from './components/Arrival';
import ArrivalRanking from './components/ArrivalRanking';
import Summary from './components/Summary';
import NumberRanking from './components/NumberRanking';
import Work from './components/Work';
import TaskStatistics from './components/TaskStatistics';
import Contrast from './components/Contrast';
import { isArray } from '../../components/ToolUtil';
import styles from '../index.less';

const InStockReport = ({ layout = {} }) => {

  const table = isArray(layout?.steps)[0]?.data || [];

  return table.map((item, index) => {
    const rows = item[0]?.data || [];
    const childrens = rows.map((item, index) => {
      switch (item.key) {
        case 'Arrival':
          return <Arrival key={index} />;
        case 'ArrivalRanking':
          return <ArrivalRanking key={index} />;
        case 'Summary':
          return <Summary key={index} />;
        case 'NumberRanking':
          return <NumberRanking key={index} />;
        case 'Work':
          return <Work key={index} />;
        case 'TaskStatistics':
          return <TaskStatistics key={index} />;
        case 'Contrast':
          return <Contrast key={index} />;
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

export default InStockReport;
