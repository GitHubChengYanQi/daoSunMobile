import React from 'react';
import MaintenaceItem from './components/MaintenaceItem';

const MaintenanceTask = (
  {
    data = [],
  },
) => {

  return data.map((item, index) => {
    return <MaintenaceItem item={item} index={index} />;
  });
};

export default MaintenanceTask;
