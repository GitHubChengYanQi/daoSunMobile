import React from 'react';
import TaskStatistics from './components/TaskStatistics';
import { isArray } from '../../components/ToolUtil';
import styles from '../index.less';
import Contrast from './components/Contrast';
import NumberRanking from './components/NumberRanking';
import Maintenance from './components/Maintenance';

const MaintenanceReport = ({ layout }) => {


  const table = isArray(layout?.steps)[0]?.data || [];

  return table.map((item, index) => {
    const rows = item[0]?.data || [];
    const childrens = rows.map((item, index) => {
      switch (item.key) {
        case 'Number':
          return <div key={index}>
            <NumberRanking title={item.filedName} />
          </div>;
        case 'Maintenance':
          return <div key={index}>
            <Maintenance  title={item.filedName} />
          </div>;
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

export default MaintenanceReport;
