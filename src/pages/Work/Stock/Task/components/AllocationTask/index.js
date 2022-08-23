import React from 'react';
import AllocationItem from './components/AllocationItem';

const AllocationTask = (
  {
    data = [],
  },
) => {

  return data.map((item, index) => {
    return <AllocationItem item={item} index={index} />;
  });
};

export default AllocationTask;
