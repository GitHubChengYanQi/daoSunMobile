import React from 'react';
import TaskItem from '../../../TaskItem';
import { isObject, ToolUtil } from '../../../../../../../components/ToolUtil';

const ErrorItem = (
  {
    item = {},
    index,
    onClick = () => {
    },
    noProgress,
  }) => {

  const receipts = item.receipts || {};

  const percent = parseInt((receipts.handle / receipts.total) * 100);

  return <TaskItem
    task={item}
    noProgress={noProgress}
    percent={percent}
    statusName={receipts.statusName || '进行中'}
    action={![99, 50].includes(receipts.status)}
    complete={[99, 50].includes(receipts.status)}
    skus={ToolUtil.isArray(receipts.anomalyResults).filter((item, index) => index < 2).map(item => ({
      ...item,
      number: item.realNumber,
    }))}
    coding={receipts.coding}
    endTime={receipts.endTime}
    createTime={item.createTime}
    taskName={item.taskName}
    index={index}
    positionSize={receipts.positionNum}
    origin={isObject(item.themeAndOrigin)}
    skuSize={receipts.skuNumber}
    beginTime={receipts.beginTime}
    onClick={() => onClick(item)}
    users={ToolUtil.isArray(item.processUsers)}
  />;
};

export default ErrorItem;
