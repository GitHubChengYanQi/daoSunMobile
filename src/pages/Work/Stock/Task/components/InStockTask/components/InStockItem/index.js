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

  const statusName = () => {
    if (percent === 100) {
      return <>已完成</>;
    } else {
      return <>可入库</>;
    }
  };

  return <TaskItem
    statusName={statusName()}
    percent={percent}
    action={(receipts.canPut && percent !== 100)}
    coding={receipts.coding}
    endTime={receipts.endTime}
    createTime={item.createTime}
    taskName={item.taskName}
    index={index}
    skus={ToolUtil.isArray(receipts.instockListResults).filter((item,index)=>index < 2)}
    skuSize={receipts.skuNum}
    positionSize={receipts.positionNum}
    origin={isObject(item.themeAndOrigin)}
    beginTime={receipts.beginTime}
    onClick={() => onClick(item)}
    users={ToolUtil.isArray(item.processUsers).length > 0 ? ToolUtil.isArray(item.processUsers).map(item => item.name).toString() : ToolUtil.isObject(item.user).name}
  />;
};

export default InStockItem;
