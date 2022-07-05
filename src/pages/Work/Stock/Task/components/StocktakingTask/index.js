import React from 'react';
import StocktakingItem from './components/StocktakingItem';

const StocktakingTask = (
  {
    data = [],
  },
) => {

  return data.map((item, index) => {
   return <StocktakingItem item={item} index={index} />
  });
};

export default StocktakingTask;
