import React from 'react';
import TaskItem from '../../../TaskItem';
import { isObject, ToolUtil } from '../../../../../../../components/ToolUtil';

const AllocationItem = (
  {
    item = {},
    index,
    onClick=()=>{}
  }) => {

  const receipts = item.receipts || {};

  const percent = parseInt((receipts.doneNumber / (receipts.detailNumber / 1)) * 100);

  return <TaskItem
    users={ToolUtil.isObject(receipts.userResult).name || '未分配'}
    percent={percent}
    statusName={receipts.statusName || '进行中'}
    action={receipts.status !== 99}
    skus={receipts.detailResults}
    coding={receipts.coding}
    createTime={item.createTime}
    taskName={item.taskName}
    skuSize={receipts.skuCount || 0}
    positionSize={receipts.positionCount || 0}
    index={index}
    origin={isObject(item.themeAndOrigin)}
    onClick={()=>onClick(item)}
  />;
};

export default AllocationItem;
