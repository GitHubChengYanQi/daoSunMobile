import React from 'react';
import { history } from 'umi';
import TaskItem from '../../../TaskItem';
import style from '../../../StocktakingTask/components/StocktakingItem/index.less';

const ErrorItem = (
  {
    item = {},
    index,
  }) => {

  const receipts = item.receipts || {};

  let needNumber = 0;
  let errorNumber = 0;
  let otherNumber = 0;

  const anomalyResults = receipts.anomalyResults || [];

  anomalyResults.forEach(item => {
    needNumber += item.needNumber;
    errorNumber += item.errorNumber;
    otherNumber += item.otherNumber;
  });

  let totalTitle = '';
  switch (receipts.type) {
    case 'instock':
      totalTitle = '申请总数';
      break;
    case 'Stocktaking':
    case 'timelyInventory':
      totalTitle = '实际总数';
      break;
    default:
      break;
  }

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
    orderData={<div className={style.status}>
      <div>
        {totalTitle}：<span className={style.blue}>{needNumber}</span>
      </div>
      <div hidden={!errorNumber}>
        数量差异：<span className={style.red}>{errorNumber > 0 ? `+${errorNumber}` : errorNumber}</span>
      </div>
      <div hidden={!otherNumber}>
        其他异常：<span className={style.yellow}>{otherNumber}</span>
      </div>
    </div>}
  />;
};

export default ErrorItem;
