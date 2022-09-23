import React from 'react';
import TaskItem from '../../../TaskItem';
import { isObject, ToolUtil } from '../../../../../../../components/ToolUtil';

const StocktakingItem = (
  {
    item,
    index,
    onClick = () => {
    },
  },
) => {

  const receipts = item.receipts || {};

  const percent = parseInt((receipts.handle / receipts.total) * 100);

  return <>
    <TaskItem
      percent={percent}
      coding={receipts.coding}
      endTime={receipts.endTime}
      createTime={item.createTime}
      taskName={item.taskName}
      statusName={receipts.statusName || '进行中'}
      action={receipts.status !== 99}
      origin={isObject(item.themeAndOrigin)}
      index={index}
      skus={ToolUtil.isArray(receipts.stockResults)}
      skuSize={receipts.skuSize}
      positionSize={receipts.positionSize}
      beginTime={receipts.beginTime}
      onClick={() => onClick(item)}
      userLabel='负责人'
      users={ToolUtil.isObject(receipts.user).name}
    />
  </>;
};

export default StocktakingItem;
