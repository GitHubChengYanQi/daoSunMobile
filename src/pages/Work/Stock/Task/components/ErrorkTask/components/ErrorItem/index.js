import React from 'react';
import TaskItem from '../../../TaskItem';
import { isObject, ToolUtil } from '../../../../../../../components/ToolUtil';

const ErrorItem = (
  {
    item = {},
    index,
    onClick = () => {
    },
  }) => {

  const receipts = item.receipts || {};

  const percent = parseInt((receipts.handle / receipts.total) * 100);

  const statusName = () => {
    if (percent === 100) {
      return <>已完成</>;
    } else {
      return <>{receipts.statusName || '进行中'}</>;
    }
  };

  return <TaskItem
    percent={percent}
    statusName={statusName()}
    action
    skus={ToolUtil.isArray(receipts.anomalyResults).filter((item, index) => index < 2)}
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
  />;
};

export default ErrorItem;
