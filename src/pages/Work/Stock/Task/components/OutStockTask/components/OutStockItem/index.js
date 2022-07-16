import React from 'react';
import { ToolUtil } from '../../../../../../../components/ToolUtil';
import { history } from 'umi';
import TaskItem from '../../../TaskItem';
import style from '../../../StocktakingTask/components/StocktakingItem/index.less';

const OutStockItem = (
  {
    item = {},
    index,
  }) => {

  const receipts = item.receipts || {};

  const onClick = () => {
    history.push(`/Receipts/ReceiptsDetail?id=${item.processTaskId}`);
  };

  return <TaskItem
    coding={receipts.coding}
    endTime={receipts.endTime}
    createTime={item.createTime}
    taskName={item.taskName}
    index={index}
    skuSize={receipts.skuSize}
    positionSize={receipts.positionSize}
    beginTime={receipts.beginTime}
    onClick={onClick}
    otherData={
      <div className={style.orderData}>
        <div className={style.user}>负责人：{ToolUtil.isObject(receipts.userResult).name || '无'}</div>
      </div>}
  />;
};

export default OutStockItem;
