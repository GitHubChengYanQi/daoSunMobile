import React from 'react';
import TaskItem from '../../../TaskItem';
import { isObject, ToolUtil } from '../../../../../../../../util/ToolUtil';

const AllocationItem = (
  {
    item = {},
    index,
    onClick = () => {
    },
    noProgress,
  }) => {

  const receipts = item.receipts || {};

  const percent = parseInt((receipts.doneNumber / (receipts.detailNumber / 1)) * 100);

  return <TaskItem
    task={item}
    noProgress={noProgress}
    users={receipts.userResult ? [] : [receipts.userResult]}
    percent={percent}
    statusName={receipts.statusName || '进行中'}
    skus={receipts.detailResults}
    coding={receipts.coding}
    createTime={item.createTime}
    taskName={item.taskName}
    skuSize={receipts.skuCount || 0}
    positionSize={receipts.positionCount || 0}
    index={index}
    origin={isObject(item.themeAndOrigin)}
    onClick={() => onClick(item)}
  />;
};

export default AllocationItem;
