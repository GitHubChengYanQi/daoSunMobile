import React from 'react';
import TaskItem from '../../../TaskItem';
import { isObject, ToolUtil } from '../../../../../../../components/ToolUtil';

const InStockItem = (
  {
    item = {},
    index,
    onClick = () => {
    },
    noProgress
  }) => {

  const receipts = item.receipts || {};

  const percent = parseInt((receipts.inStockNum / receipts.applyNum) * 100);

  return <TaskItem
    task={item}
    noProgress={noProgress}
    statusName={receipts.statusName || '进行中'}
    percent={percent}
    coding={receipts.coding}
    endTime={receipts.endTime}
    createTime={item.createTime}
    taskName={item.taskName}
    index={index}
    skus={ToolUtil.isArray(receipts.instockListResults).filter((item, index) => index < 2)}
    skuSize={receipts.skuNum}
    positionSize={receipts.positionNum}
    origin={isObject(item.themeAndOrigin)}
    beginTime={receipts.beginTime}
    onClick={() => onClick(item)}
    users={ToolUtil.isArray(item.processUsers)}
  />;
};

export default InStockItem;
