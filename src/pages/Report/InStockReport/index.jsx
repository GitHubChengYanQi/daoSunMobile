import React from 'react';
import Arrival from './components/Arrival';
import ArrivalRanking from './components/ArrivalRanking';
import Summary from './components/Summary';
import NumberRanking from './components/NumberRanking';
import Work from './components/Work';
import TaskStatistics from './components/TaskStatistics';
import Contrast from './components/Contrast';
import { isArray } from '../../../util/ToolUtil';
import styles from '../index.less';

const InStockReport = ({ layout = {} }) => {

  const table = isArray(layout?.steps)[0]?.data || [];

  return table.map((item, index) => {
    const rows = item[0]?.data || [];
    const childrens = rows.map((item, index) => {
      switch (item.key) {
        case 'Arrival':
          return <div key={index}>
            <Arrival title={item.filedName} />
            <ArrivalRanking />
          </div>;
        case 'Summary':
          return <div key={index}>
            <Summary title={item.filedName} />
            <NumberRanking />
          </div>;
        case 'Work':
          return <Work title={item.filedName} key={index} />;
        case 'TaskStatistics':
          return <div key={index}>
            <TaskStatistics title={item.filedName} />
            <Contrast />
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

export default InStockReport;
