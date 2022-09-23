import React from 'react';
import TaskItem from '../../../TaskItem';
import { isObject, ToolUtil } from '../../../../../../../components/ToolUtil';
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

  const percent = parseInt((receipts.doneNumberCount / (receipts.numberCount / 1)) * 100);

  return <TaskItem
    statusName={receipts.statusName || '进行中'}
    action={receipts.status !== 99}
    percent={percent}
    coding={receipts.coding}
    skus={receipts.detailResults}
    endTime={receipts.endTime}
    createTime={item.createTime}
    origin={isObject(item.themeAndOrigin)}
    taskName={item.taskName}
    index={index}
    skuSize={receipts.skuCount}
    positionSize={receipts.positionCount}
    beginTime={receipts.startTime}
    onClick={() => onClick(item)}
    otherData={
      <div className={style.orderData}>
        <div className={style.user}>负责人：{ToolUtil.isObject(receipts.userResult).name}</div>
      </div>}
  />;
};

export default MaintenaceItem;
