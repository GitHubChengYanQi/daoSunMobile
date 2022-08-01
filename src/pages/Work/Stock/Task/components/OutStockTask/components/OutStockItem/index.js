import React from 'react';
import { history } from 'umi';
import TaskItem from '../../../TaskItem';
import style from '../../../StocktakingTask/components/StocktakingItem/index.less';
import { UserName } from '../../../../../../../components/User';

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
    statusName={<>
      可 <br />备 <br />料
    </>}
    statusNameClassName={item.canOperate ? style.backBlue : style.backEee}
    percent={parseInt((receipts.receivedCount / receipts.numberCount) * 100)}
    coding={receipts.coding}
    endTime={receipts.endTime}
    createTime={item.createTime}
    taskName={item.taskName}
    index={index}
    skuSize={receipts.skuCount || 0}
    positionSize={receipts.positionCount || 0}
    beginTime={receipts.beginTime}
    onClick={onClick}
    otherData={
      <div className={style.orderData}>
        <div className={style.user}>负责人：<UserName user={receipts.userResult} /></div>
      </div>}
  />;
};

export default OutStockItem;
