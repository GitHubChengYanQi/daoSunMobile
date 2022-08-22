import React from 'react';
import TaskItem from '../../../TaskItem';

const InStockItem = (
  {
    item = {},
    index,
    onClick=()=>{}
  }) => {

  const receipts = item.receipts || {};

  return <TaskItem
    percent={parseInt((receipts.inStockNum / receipts.applyNum) * 100)}
    coding={receipts.coding}
    endTime={receipts.endTime}
    createTime={item.createTime}
    taskName={item.taskName}
    index={index}
    skuSize={receipts.skuNum}
    positionSize={receipts.positionNum}
    beginTime={receipts.beginTime}
    onClick={()=>onClick(item)}
  />;
};

export default InStockItem;
