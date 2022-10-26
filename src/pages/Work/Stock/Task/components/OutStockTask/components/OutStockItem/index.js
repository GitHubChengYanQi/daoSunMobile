import React from 'react';
import TaskItem from '../../../TaskItem';
import { isObject, ToolUtil } from '../../../../../../../components/ToolUtil';
import { OutProgress } from '../../../../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/OutStockOrder/components/OutSkuAction/compoennts/OutSkuItem';

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
    noProgress={noProgress}
    otherData={<>领料人：{receipts?.userResult?.name}</>}
    users={ToolUtil.isArray(item.processUsers)}
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
    processRender={<OutProgress
      collectable={1}
      notPrepared={2}
      received={3}
      percent={4}
      successPercent={5}
    />}
  />;
};

export default OutStockItem;
