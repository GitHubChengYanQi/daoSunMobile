import React from 'react';
import InStockItem from './components/InStockItem';

const InStockTask = (
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
    return <InStockItem item={item} index={index} onChange={dataChange} />;
  });
};

export default InStockTask;
