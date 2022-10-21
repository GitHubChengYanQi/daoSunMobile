import React from 'react';
import { useModel } from 'umi';
import TaskItem from '../../../TaskItem';
import { isObject, ToolUtil } from '../../../../../../../components/ToolUtil';

const ForwardItem = (
  {
    item,
    onClick = () => {
    },
    noProgress,
  },
) => {

  const { initialState } = useModel('@@initialState');
  const state = initialState || {};
  const userInfo = state.userInfo || {};

  const receipts = item.receipts || {};

  const details = receipts.details || [];

  let myDetails = 0;
  let complete = 0;
  details.forEach(item => {
    if (item.userId === userInfo.id) {
      if (item.stauts !== 0) {
        complete++;
      }
      myDetails++;
    }
  });

  const percent = parseInt((complete / myDetails) * 100);

  return <TaskItem
    task={item}
    noProgress={noProgress}
    percent={percent}
    statusName={receipts.statusName || '进行中'}
    action={![99, 50].includes(receipts.status)}
    complete={[99, 50].includes(receipts.status)}
    skus={[{ ...receipts, number: receipts.realNumber }]}
    coding={receipts.coding}
    endTime={receipts.endTime}
    createTime={item.createTime}
    origin={isObject(item.themeAndOrigin)}
    taskName={item.taskName}
    skuSize={1}
    positionSize={1}
    onClick={() => onClick(item)}
    users={ToolUtil.isArray(item.processUsers)}
  />;
};

export default ForwardItem;
