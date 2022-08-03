import React from 'react';
import { history } from 'umi';
import TaskItem from '../../../TaskItem';

const ErrorItem = (
  {
    item = {},
    index,
  }) => {

  const receipts = item.receipts || {};

  const onClick = () => {
    history.push(`/Receipts/ReceiptsDetail?id=${item.processTaskId}`);
  };

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
    onClick={onClick}
  />;
};

export default ErrorItem;
