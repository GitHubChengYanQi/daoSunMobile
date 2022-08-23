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
    coding={receipts.coding}
    createTime={item.createTime}
    taskName={item.taskName}
    index={index}
    onClick={()=>onClick(item)}
    otherData={
      <div className={style.orderData}>
        <div className={style.user}>负责人：{ToolUtil.isObject(receipts.userResult).name || '无'}</div>
      </div>}
  />;
};

export default AllocationItem;
