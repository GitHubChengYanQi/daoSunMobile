import React from 'react';
import TaskItem from '../../../TaskItem';
import { ToolUtil } from '../../../../../../../components/ToolUtil';
import style from '../../../StocktakingTask/components/StocktakingItem/index.less';

const MaintenaceItem = (
  {
    item = {},
    index,
    onClick = () => {
    },
  },
) => {

  const receipts = item.receipts || {};

  return <TaskItem
    percent={parseInt((receipts.doneNumberCount / (receipts.numberCount / 1)) * 100)}
    coding={receipts.coding}
    endTime={receipts.endTime}
    createTime={item.createTime}
    taskName={item.taskName}
    index={index}
    skuSize={receipts.skuCount}
    positionSize={receipts.positionCount}
    beginTime={receipts.startTime}
    onClick={()=>onClick(item)}
    otherData={
      <div className={style.orderData}>
        <div className={style.user}>负责人：{ToolUtil.isObject(receipts.user).name}</div>
      </div>}
  />;
};

export default MaintenaceItem;
