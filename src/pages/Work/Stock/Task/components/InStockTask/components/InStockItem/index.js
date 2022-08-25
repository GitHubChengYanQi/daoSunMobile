import React from 'react';
import TaskItem from '../../../TaskItem';
import style from '../../../StocktakingTask/components/StocktakingItem/index.less';
import { ToolUtil } from '../../../../../../../components/ToolUtil';

export const rulesUser = (rules = []) => {
  const users = [];
  if (rules.length > 0) {
    rules.map((items) => {
      switch (items.type) {
        case 'AppointUsers':
          items.appointUsers && items.appointUsers.map((itemuser) => {
            return users.push(itemuser.title);
          });
          break;
        case 'DeptPositions':
          items.deptPositions && items.deptPositions.map((itemdept) => {
            return users.push(`${itemdept.title}(${itemdept.positions && itemdept.positions.map((items) => {
              return items.label;
            })})`);
          });
          break;
        case 'AllPeople':
          users.push('所有人');
          break;
        case 'MasterDocumentPromoter':
          users.push('主单据发起人');
          break;
        case 'Director':
          users.push('单据负责人');
          break;
        default:
          break;
      }
    });
  }
  return users;
};

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
        <div className={style.user}>
          负责人：{rulesUser(item.rules).length > 0 ? rulesUser(item.rules).toString() : ToolUtil.isObject(item.user).name}
        </div>
      </div>}
  />;
};

export default InStockItem;
