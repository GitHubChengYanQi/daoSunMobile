import React from 'react';
import TaskItem from '../../../TaskItem';
import { isObject, ToolUtil } from '../../../../../../../../util/ToolUtil';
import styles from '../../../../index.less';
import MyProgress from '../../../../../../../components/MyProgress';
import {
  collectableColor,
  notPreparedColor,
  receivedColor,
} from '../../../../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/OutStockOrder/components/OutSkuAction/compoennts/MyPicking';

const OutStockItem = (
  {
    item = {},
    index,
    pick,
    onClick = () => {
    },
    noProgress,
  }) => {

  const receipts = item.receipts || {};

  const canPick = receipts.canPick;
  const canOperate = receipts.canOperate;

  const can = pick ? canPick : (canOperate === undefined ? canPick : canOperate);

  const received = receipts.receivedCount || 0;
  const collectable = receipts.cartNumCount || 0;

  const successPercent = Number(((received / receipts.numberCount)).toFixed(2)) * 100;
  const percent = Number(((collectable / receipts.numberCount)).toFixed(2)) * 100;

  return <TaskItem
    task={item}
    action={can}
    noProgress={noProgress}
    otherData={<>领料人：{receipts?.userResult?.name}</>}
    users={ToolUtil.isArray(item.processUsers)}
    statusName={receipts.statusName}
    percent={percent}
    coding={receipts.coding}
    endTime={receipts.endTime}
    skus={receipts.detailResults}
    createTime={item.createTime}
    taskName={item.taskName}
    index={index}
    origin={isObject(item.themeAndOrigin)}
    skuSize={receipts.skuCount || 0}
    positionSize={receipts.positionCount || 0}
    beginTime={receipts.beginTime}
    onClick={() => onClick(item)}
    processRender={<MyProgress
      className={styles.outProcess}
      percent={percent + successPercent}
      success={{ percent: successPercent, strokeColor: receivedColor }}
      trailColor={notPreparedColor}
      strokeColor={collectableColor}
    />}
  />;
};

export default OutStockItem;
