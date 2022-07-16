import React from 'react';
import { history } from 'umi';
import TaskItem from '../../../TaskItem';
import { ToolUtil } from '../../../../../../../components/ToolUtil';
import { MyDate } from '../../../../../../../components/MyDate';
import style from '../../../StocktakingTask/components/StocktakingItem/index.less';

const MaintenaceItem = (
  {
    item = {},
    index,
  },
) => {

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
    skuSize={receipts.skuCount}
    positionSize={receipts.positionCount}
    beginTime={receipts.startTime}
    onClick={onClick}
    orderData={<div className={style.status}>
      <div>
        类型：复检复调
      </div>
    </div>}
    otherData={
      <div className={style.orderData}>
        <div className={style.user}>负责人：{ToolUtil.isObject(receipts.user).name}</div>
        <div>{MyDate.Show(receipts.startTime)} - {MyDate.Show(receipts.endTime)}</div>
      </div>}
  />;
};

export default MaintenaceItem;
