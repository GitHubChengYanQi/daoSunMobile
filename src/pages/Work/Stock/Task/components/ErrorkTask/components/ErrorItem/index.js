import React from 'react';
import TaskItem from '../../../TaskItem';

const ErrorItem = (
  {
    item = {},
    index,
    onClick = () => {
    },
  }) => {

  const receipts = item.receipts || {};

  return <TaskItem
    percent={parseInt((receipts.handle / receipts.total) * 100)}
    coding={receipts.coding}
    endTime={receipts.endTime}
    createTime={item.createTime}
    taskName={item.taskName}
    index={index}
    positionSize={receipts.positionNum}
    skuSize={receipts.skuNumber}
    beginTime={receipts.beginTime}
    onClick={()=>onClick(item)}
  />;
};

export default ErrorItem;
