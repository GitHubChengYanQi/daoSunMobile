import React from 'react';
import TaskItem from '../../../TaskItem';
import style from '../../../StocktakingTask/components/StocktakingItem/index.less';
import { ToolUtil } from '../../../../../../../components/ToolUtil';

const OutStockItem = (
  {
    item = {},
    index,
    pick,
    onClick = () => {
    },
  }) => {

  const receipts = item.receipts || {};

  const canPick = receipts.canPick;
  const canOperate = receipts.canOperate;

  const can = pick ? canPick : (canOperate === undefined ? canPick : canOperate);

  return <TaskItem
    statusName={(pick || canOperate === undefined) ? <>
      可 <br />领 <br />料
    </> : <>
      可 <br />备<br />料
    </>}
    statusNameClassName={can ? style.backBlue : style.backEee}
    percent={parseInt((receipts.receivedCount / receipts.numberCount) * 100)}
    coding={receipts.coding}
    endTime={receipts.endTime}
    createTime={item.createTime}
    taskName={item.taskName}
    index={index}
    skuSize={receipts.skuCount || 0}
    positionSize={receipts.positionCount || 0}
    beginTime={receipts.beginTime}
    onClick={()=>onClick(item)}
    otherData={
      <div className={style.orderData}>
        <div className={style.user}>负责人：{ToolUtil.isObject(receipts.userResult).name || '无'}</div>
      </div>}
  />;
};

export default OutStockItem;
