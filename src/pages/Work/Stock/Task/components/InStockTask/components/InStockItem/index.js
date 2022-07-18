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
    percent={parseInt((receipts.inStockNum / receipts.applyNum) * 100)}
    coding={receipts.coding}
    endTime={receipts.endTime}
    createTime={item.createTime}
    taskName={item.taskName}
    index={index}
    skuSize={receipts.skuNum}
    positionSize={receipts.positionNum}
    beginTime={receipts.beginTime}
    onClick={onClick}
  />;
};

export default InStockItem;
