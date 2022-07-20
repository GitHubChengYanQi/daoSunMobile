import React from 'react';
import { history } from 'umi';
import TaskItem from '../../../TaskItem';
import style from './index.less';
import { ToolUtil } from '../../../../../../../components/ToolUtil';
import { MyDate } from '../../../../../../../components/MyDate';

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
      orderData={<div className={style.status}>
        <div>
          方法：{receipts.method === 'OpenDisc' ? '明盘' : '暗盘'}
        </div>
        <div>
          方式：{receipts.mode === 'staticState' ? '静态' : '动态'}
        </div>
      </div>}
      otherData={
        <div className={style.orderData}>
          <div className={style.user}>负责人：{ToolUtil.isObject(receipts.user).name}</div>
          <div>{MyDate.Show(receipts.beginTime)} - {MyDate.Show(receipts.endTime)}</div>
        </div>}
    />
  </>;
};

export default StocktakingItem;
