import React from 'react';
import TaskItem from '../../../TaskItem';
import style from '../../../StocktakingTask/components/StocktakingItem/index.less';
import { ToolUtil } from '../../../../../../../components/ToolUtil';

const InStockItem = (
  {
    item = {},
    index,
    onClick = () => {
    },
  }) => {

  const receipts = item.receipts || {};

  const percent = parseInt((receipts.inStockNum / receipts.applyNum) * 100);

  const statusName = () => {
    if (percent === 100) {
      return <>已 <br />完 <br />成</>;
    } else {
      return <>可 <br />入 <br />库</>;
    }
  };

  return <TaskItem
    statusName={statusName()}
    statusNameClassName={(receipts.canPut && percent !== 100) ? style.backBlue : style.backEee}
    percent={percent}
    coding={receipts.coding}
    endTime={receipts.endTime}
    createTime={item.createTime}
    taskName={item.taskName}
    index={index}
    skuSize={receipts.skuNum}
    positionSize={receipts.positionNum}
    beginTime={receipts.beginTime}
    onClick={() => onClick(item)}
    otherData={
      <div className={style.orderData}>
        <div className={style.user}>负责人：{ToolUtil.isObject(receipts.userResult).name || '无'}</div>
      </div>}
  />;
};

export default InStockItem;
