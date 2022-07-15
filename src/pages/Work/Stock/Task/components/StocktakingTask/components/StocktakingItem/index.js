import React from 'react';
import { history } from 'umi';
import TaskItem from '../../../TaskItem';
import style from './index.less';
import { Progress } from 'antd';
import { ToolUtil } from '../../../../../../../components/ToolUtil';
import { MyDate } from '../../../../../../../components/MyDate';

const StocktakingItem = ({ item, index }) => {

  const onClick = () => {
    history.push(`/Receipts/ReceiptsDetail?id=${item.processTaskId}`);
  };

  const receipts = item.receipts;

  return <>
    <TaskItem
      coding={receipts.coding}
      endTime={receipts.endTime}
      createTime={item.createTime}
      taskName={item.taskName}
      index={index}
      skuSize={receipts.skuSize}
      positionSize={receipts.positionSize}
      beginTime={receipts.beginTime}
      onClick={onClick}
      otherData={<div>
        <div className={style.status}>
          <div>明盘</div>
          <div>静态</div>
        </div>
        <div className={style.progress}>
          <Progress
            format={(number) => {
              return <span className={style.blue}>{number + '%'}</span>;
            }}
            percent={60}
          />
        </div>
        <div className={style.orderData}>
          <div className={style.user}>负责人：{ToolUtil.isObject(receipts.user).name}</div>
          <div>{MyDate.Show(receipts.beginTime)} - {MyDate.Show(receipts.endTime)}</div>
        </div>

      </div>}
    />
  </>;
};

export default StocktakingItem;
