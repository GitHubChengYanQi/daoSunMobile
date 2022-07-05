import React from 'react';
import OutStockItem from './components/OutStockItem';

const OutStockTask = (
  {
    data = [],
    setData = () => {
    },
  },
) => {

  const dataChange = (param, currentIndex) => {
    const newData = data.map((item, index) => {
      if (index === currentIndex) {
        return { ...item, ...param };
      }
      return item;
    });
    setData(newData);
  };


  return data.map((item, index) => {
    return <OutStockItem item={item} index={index} onChange={dataChange} />;
  });
};

export default OutStockTask;
