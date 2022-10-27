import React from 'react';
import TaskItem from '../../../TaskItem';
import { isObject, ToolUtil } from '../../../../../../../components/ToolUtil';
import { MyDate } from '../../../../../../../components/MyDate';

const StocktakingItem = (
  {
    item,
    index,
    onClick = () => {
    },
    noProgress,
  },
) => {

  const receipts = item.receipts || {};

  const percent = parseInt((receipts.handle / receipts.total) * 100);

  return <>
    <TaskItem
      task={item}
      noProgress={noProgress}
      otherData={MyDate.Show(receipts.beginTime)+' - '+MyDate.Show(receipts.endTime)}
      percent={percent}
      coding={receipts.coding}
      endTime={receipts.endTime}
      createTime={item.createTime}
      taskName={item.taskName}
      statusName={receipts.statusName || '进行中'}
      origin={isObject(item.themeAndOrigin)}
      index={index}
      skus={ToolUtil.isArray(receipts.stockResults)}
      skuSize={receipts.skuSize}
      positionSize={receipts.positionSize}
      beginTime={receipts.beginTime}
      onClick={() => onClick(item)}
      userLabel='负责人'
      users={receipts.user ? [receipts.user] : []}
    />
  </>;
};

export default StocktakingItem;
