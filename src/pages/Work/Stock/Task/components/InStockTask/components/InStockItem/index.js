import React from 'react';
import { history } from 'umi';
import TaskItem from '../../../TaskItem';

const InStockItem = (
  {
    item = {},
    index,
  }) => {

  const receipts = item.receipts || {};

  const onClick = () => {
    history.push(`/Receipts/ReceiptsDetail?id=${item.processTaskId}`);
  };

  return <TaskItem
    coding={receipts.coding}
    endTime={receipts.endTime}
    createTime={item.createTime}
    taskName={item.taskName}
    index={index}
    skuSize={receipts.skuSize}
    positionSize={receipts.positionSize}
    beginTime={receipts.beginTime}
    onClick={onClick}
  />;
};

export default InStockItem;
