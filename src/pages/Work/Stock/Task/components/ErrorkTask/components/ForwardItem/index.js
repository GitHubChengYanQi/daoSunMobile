import React from 'react';
import { useModel } from 'umi';
import TaskItem from '../../../TaskItem';
import { isObject } from '../../../../../../../components/ToolUtil';

const ForwardItem = (
  {
    item,
    onClick = () => {
    },
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
    percent={percent}
    statusName={receipts.statusName || '进行中'}
    action={receipts.status !== 99}
    skus={[{ ...receipts, number: receipts.realNumber }]}
    coding={receipts.coding}
    endTime={receipts.endTime}
    createTime={item.createTime}
    origin={isObject(item.themeAndOrigin)}
    taskName={item.taskName}
    skuSize={1}
    positionSize={1}
    onClick={() => onClick(item)}
  />;
};

export default ForwardItem;
