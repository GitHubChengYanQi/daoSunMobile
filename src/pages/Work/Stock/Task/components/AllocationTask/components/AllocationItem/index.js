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

  return <TaskItem
    percent={parseInt((receipts.doneNumber / (receipts.detailNumber / 1)) * 100)}
    coding={receipts.coding}
    createTime={item.createTime}
    taskName={item.taskName}
    skuSize={receipts.skuCount || 0}
    positionSize={receipts.positionCount || 0}
    index={index}
    onClick={()=>onClick(item)}
    otherData={
      <div className={style.orderData}>
        <div className={style.user}>负责人：{ToolUtil.isObject(receipts.userResult).name || '未分配'}</div>
      </div>}
  />;
};

export default AllocationItem;
