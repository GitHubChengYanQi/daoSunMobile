import React from 'react';
import ErrorItem from './components/ErrorItem';

const ErrorTask = (
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
    return <ErrorItem item={item} index={index} onChange={dataChange} />;
  });
};

export default ErrorTask;
