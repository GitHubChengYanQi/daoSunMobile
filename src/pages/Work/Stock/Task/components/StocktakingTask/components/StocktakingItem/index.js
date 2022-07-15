import React from 'react';
import { history } from 'umi';
import TaskItem from '../../../TaskItem';

const StocktakingItem = ({ item, index }) => {

  const onClick = () => {
    history.push(`/Receipts/ReceiptsDetail?id=${item.processTaskId}`);
  };

  return <>
    <TaskItem onClick={onClick} item={item} index={index} />
  </>;
};

export default StocktakingItem;
