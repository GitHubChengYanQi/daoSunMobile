import React from 'react';
import TaskItem from '../../../TaskItem';
import { isObject, ToolUtil } from '../../../../../../../components/ToolUtil';

const InStockItem = (
  {
    item = {},
    index,
    onClick = () => {
    },
  }) => {

  const receipts = item.receipts || {};

  const percent = parseInt((receipts.inStockNum / receipts.applyNum) * 100);

  return <TaskItem
    statusName={receipts.statusName || '进行中'}
    percent={percent}
    action={![99, 50].includes(receipts.status)}
    complete={[99, 50].includes(receipts.status)}
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
    users={ToolUtil.isArray(item.processUsers).length > 0 ? ToolUtil.isArray(item.processUsers).map(item => item.name).toString() : ToolUtil.isObject(item.user).name}
  />;
};

export default InStockItem;
