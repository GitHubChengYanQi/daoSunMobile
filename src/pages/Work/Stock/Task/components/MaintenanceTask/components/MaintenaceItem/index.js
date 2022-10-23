import React from 'react';
import TaskItem from '../../../TaskItem';
import { isObject } from '../../../../../../../components/ToolUtil';
import { MyDate } from '../../../../../../../components/MyDate';

const MaintenaceItem = (
  {
    item = {},
    index,
    onClick = () => {
    },
    noProgress,
  },
) => {

  const receipts = item.receipts || {};

  const percent = parseInt((receipts.doneNumberCount / (receipts.numberCount / 1)) * 100);

  return <TaskItem
    task={item}
    noProgress={noProgress}
    otherData={MyDate.Show(receipts.startTime)+' - '+MyDate.Show(receipts.endTime)}
    users={receipts.userResult ? [receipts.userResult] : []}
    statusName={receipts.statusName || '进行中'}
    action={![99, 50].includes(receipts.status)}
    complete={[99, 50].includes(receipts.status)}
    percent={percent}
    coding={receipts.coding}
    skus={receipts.maintenanceDetailResults}
    endTime={receipts.endTime}
    createTime={item.createTime}
    origin={isObject(item.themeAndOrigin)}
    taskName={item.taskName}
    index={index}
    skuSize={receipts.skuCount}
    positionSize={receipts.positionCount}
    beginTime={receipts.startTime}
    onClick={() => onClick(item)}
  />;
};

export default MaintenaceItem;
