import React from 'react';
import TaskItem from '../../../TaskItem';
import { isObject, ToolUtil } from '../../../../../../../components/ToolUtil';

const OutStockItem = (
  {
    item = {},
    index,
    pick,
    onClick = () => {
    },
    noProgress,
  }) => {

  const receipts = item.receipts || {};

  const canPick = receipts.canPick;
  const canOperate = receipts.canOperate;

  const can = pick ? canPick : (canOperate === undefined ? canPick : canOperate);

  const percent = parseInt((receipts.receivedCount / receipts.numberCount) * 100);

  return <TaskItem
    task={item}
    action={can}
    noProgress={noProgress}
    otherData={<>领料人：{receipts?.userResult?.name}</>}
    otherUserLabel='领料人'
    users={ToolUtil.isArray(item.processUsers)}
    statusName={receipts.statusName}
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
