import React from 'react';
import TaskItem from '../../../TaskItem';
import style from '../../../StocktakingTask/components/StocktakingItem/index.less';
import { isObject, ToolUtil } from '../../../../../../../components/ToolUtil';
import { UserOutline } from 'antd-mobile-icons';
import { Space } from 'antd-mobile';

const OutStockItem = (
  {
    item = {},
    index,
    pick,
    onClick = () => {
    },
  }) => {

  const receipts = item.receipts || {};

  const canPick = receipts.canPick;
  const canOperate = receipts.canOperate;

  const can = pick ? canPick : (canOperate === undefined ? canPick : canOperate);

  const percent = parseInt((receipts.receivedCount / receipts.numberCount) * 100);

  return <TaskItem
    users={ToolUtil.isArray(item.processUsers).length > 0 ? ToolUtil.isArray(item.processUsers).map(item => item.name).toString() : ToolUtil.isObject(item.user).name}
    statusName={receipts.statusName}
    action={![99, 50].includes(receipts.status)}
    complete={[99, 50].includes(receipts.status)}
    percent={percent}
    coding={receipts.coding}
    endTime={receipts.endTime}
    skus={receipts.detailResults}
    createTime={item.createTime}
    taskName={item.taskName}
    index={index}
    origin={isObject(item.themeAndOrigin)}
    skuSize={receipts.skuCount || 0}
    positionSize={receipts.positionCount || 0}
    beginTime={receipts.beginTime}
    onClick={() => onClick(item)}
  />;
};

export default OutStockItem;
