import React from 'react';
import { history, useModel } from 'umi';
import TaskItem from '../../../TaskItem';

const ForwardItem = (
  {
    item,
  },
) => {

  const { initialState } = useModel('@@initialState');
  const state = initialState || {};
  const userInfo = state.userInfo || {};

  const receipts = item.receipts || {};

  const onClick = () => {
    history.push(`/Receipts/ReceiptsDetail?id=${item.processTaskId}`);
  };

  const details = receipts.details || [];

  let myDetails = 0;
  let complete = 0;

  details.forEach(item => {
    if (item.userId === userInfo.id) {
      if (item.status !== 0) {
        complete++;
      }
      myDetails++;
    }
  });

  return <TaskItem
    percent={parseInt((complete / myDetails) * 100)}
    coding={receipts.coding}
    endTime={receipts.endTime}
    createTime={item.createTime}
    taskName={item.taskName}
    skuSize={1}
    positionSize={1}
    onClick={onClick}
  />;
};

export default ForwardItem;
