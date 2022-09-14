import React from 'react';
import TaskItem from '../../../TaskItem';
import style from '../../../StocktakingTask/components/StocktakingItem/index.less';
import { ToolUtil } from '../../../../../../../components/ToolUtil';

const AllocationItem = (
  {
    item = {},
    index,
    onClick=()=>{}
  }) => {

  const receipts = item.receipts || {};

  const percent = parseInt((receipts.doneNumber / (receipts.detailNumber / 1)) * 100);

  const statusName = () => {
    if (percent === 100) {
      return <>已完成</>;
    } else {
      return <>可调拨</>;
    }
  };

  return <TaskItem
    users={ToolUtil.isObject(receipts.userResult).name || '未分配'}
    percent={percent}
    statusName={statusName()}
    action
    skus={receipts.skuResults}
    coding={receipts.coding}
    createTime={item.createTime}
    taskName={item.taskName}
    skuSize={receipts.skuCount || 0}
    positionSize={receipts.positionCount || 0}
    index={index}
    onClick={()=>onClick(item)}
  />;
};

export default AllocationItem;
