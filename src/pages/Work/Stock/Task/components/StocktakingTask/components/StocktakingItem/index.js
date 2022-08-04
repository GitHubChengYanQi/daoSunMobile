import React from 'react';
import { history } from 'umi';
import TaskItem from '../../../TaskItem';
import style from './index.less';
import { ToolUtil } from '../../../../../../../components/ToolUtil';

const StocktakingItem = ({ item, index }) => {

  const onClick = () => {
    history.push(`/Receipts/ReceiptsDetail?id=${item.processTaskId}`);
  };

  const receipts = item.receipts;

  return <>
    <TaskItem
      percent={parseInt((receipts.handle / receipts.total) * 100)}
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
          <div className={style.user}>负责人：{ToolUtil.isObject(receipts.user).name}</div>
        </div>}
    />
  </>;
};

export default StocktakingItem;
