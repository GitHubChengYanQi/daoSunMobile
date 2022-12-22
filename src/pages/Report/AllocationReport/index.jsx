import React from 'react';
import { isArray } from '../../components/ToolUtil';
import styles from '../index.less';
import TaskStatistics from './components/TaskStatistics';
import Contrast from './components/Contrast';
import Allocation from './components/Allocation';
import StoreAllocation from './components/StoreAllocation';

const AllocationReport = ({ layout }) => {

  const table = isArray(layout?.steps)[0]?.data || [];

  return table.map((item, index) => {
    const rows = item[0]?.data || [];
    const childrens = rows.map((item, index) => {
      switch (item.key) {
        case 'Allocation':
          return <div key={index}>
            <Allocation title={item.filedName} />
          </div>;
        case 'StoreAllocation':
          return <div key={index}>
            <StoreAllocation title={item.filedName} />
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

export default AllocationReport;
