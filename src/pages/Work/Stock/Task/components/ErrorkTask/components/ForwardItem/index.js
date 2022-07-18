import React from 'react';
import { history } from 'umi';
import TaskItem from '../../../TaskItem';

const ForwardItem = (
  {
    item,
  },
) => {

  const receipts = item.receipts || {};

  const onClick = () => {
    history.push(`/Receipts/ReceiptsDetail?id=${item.processTaskId}`);
  };

  return  <TaskItem
    coding={receipts.coding}
    endTime={receipts.endTime}
    createTime={item.createTime}
    taskName={item.taskName}
    skuSize={receipts.skuSize}
    positionSize={receipts.positionSize}
    onClick={onClick}
  />
};

export default ForwardItem;
