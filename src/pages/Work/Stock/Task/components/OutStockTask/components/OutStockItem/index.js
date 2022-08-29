import React from 'react';
import TaskItem from '../../../TaskItem';
import style from '../../../StocktakingTask/components/StocktakingItem/index.less';
import { ToolUtil } from '../../../../../../../components/ToolUtil';
import { UserOutline } from 'antd-mobile-icons';
import { Space } from 'antd-mobile';

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

  const percent = parseInt((receipts.receivedCount / receipts.numberCount) * 100);

  const statusName = () => {
    if (percent === 100) {
      return <>已 <br />完 <br />成</>;
    } else if (pick || canOperate === undefined) {
      return <>可 <br />领 <br />料</>;
    } else {
      return <>可 <br />备 <br />料</>;
    }
  };

  return <TaskItem
    statusName={statusName()}
    statusNameClassName={(can && percent !== 100) ? style.backBlue : style.backEee}
    percent={percent}
    coding={receipts.coding}
    endTime={receipts.endTime}
    createTime={item.createTime}
    taskName={item.taskName}
    index={index}
    skuSize={receipts.skuCount || 0}
    positionSize={receipts.positionCount || 0}
    beginTime={receipts.beginTime}
    onClick={() => onClick(item)}
    otherData={
      <div className={style.orderData}>
        <div className={style.user}>
          <Space align='center'>
            <UserOutline />
            <div>
              <span>执行人：</span>
              {ToolUtil.isArray(item.processUsers).length > 0 ? ToolUtil.isArray(item.processUsers).map(item => item.name).toString() : ToolUtil.isObject(item.user).name}
            </div>
          </Space>
        </div>
      </div>
    }
  />;
};

export default OutStockItem;
