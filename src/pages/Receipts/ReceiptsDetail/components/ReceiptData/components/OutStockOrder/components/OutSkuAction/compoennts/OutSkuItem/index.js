import React from 'react';
import style
  from '../../../../../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import { ToolUtil } from '../../../../../../../../../../../util/ToolUtil';
import SkuItem from '../../../../../../../../../../Work/Sku/SkuItem';
import { Progress } from 'antd';
import { collectableColor, notPreparedColor, receivedColor } from '../MyPicking';
import pickStyle from '../MyPicking/index.less';
import ShopNumber
  from '../../../../../../../../../../Work/AddShop/components/ShopNumber';

export const OutProgress = (
  {
    percent,
    successPercent,
    received,
    collectable,
    notPrepared,
  }) => {

  return <div className={pickStyle.dataNumber}>
    <Progress
      className={pickStyle.progress}
      format={() => {
        return <></>;
      }}
      percent={percent + successPercent}
      success={{ percent: successPercent, strokeColor: receivedColor }}
      trailColor={notPreparedColor}
      strokeColor={collectableColor}
    />
    <div className={style.status}>
      <div hidden={!received} className={style.statusItem}>
        <div className={style.radius} style={{ backgroundColor: receivedColor }} />
        已领 {received}
      </div>
      <div hidden={!collectable} className={style.statusItem}>
        <div className={style.radius} style={{ backgroundColor: collectableColor }} />
        可领 {collectable}
      </div>
      <div hidden={!notPrepared} className={style.statusItem}>
        <div className={style.radius} style={{ backgroundColor: notPreparedColor }} />
        未备 {notPrepared}
      </div>
    </div>
  </div>;
};

const OutSkuItem = ({ item, dataLength, index,ask }) => {
  const skuResult = item.skuResult || {};

  const received = item.received || 0;
  const collectable = item.collectable || 0;
  const notPrepared = item.notPrepared || 0;

  const successPercent = Number(((received / item.number)).toFixed(2)) * 100;
  const percent = Number(((collectable / item.number)).toFixed(2)) * 100;

  let statusDom = <>可 <br />备 <br />料</>;
  let noAction = true;

  if (item.stockNumber) {
    if (item.number === received) {
      statusDom = <>已 <br />领 <br />完</>;
    } else if (item.number === received + collectable) {
      statusDom = <>已 <br />备 <br />完</>;
    } else {
      noAction = false;
    }
  }

  return <div className={style.out}>
    <div hidden={ask} className={ToolUtil.classNames(style.statusName, noAction && style.noStatusName)}>
      {statusDom}
    </div>
    <div className={style.skuData}>
      <div
        className={ToolUtil.classNames(style.sku)}
        style={{ paddingBottom: 8 }}
      >
        <div
          className={style.skuItem}
          style={{ paddingBottom: 0 }}
        >
          <div className={style.item}>
            <SkuItem
              number={item.stockNumber || 0}
              imgSize={74}
              skuResult={skuResult}
              extraWidth='124px'
              otherData={[
                ToolUtil.isObject(item.brandResult).brandName || '任意品牌',
                ToolUtil.isArray(item.positionNames).join('、'),
              ]}
            />
          </div>
          <div className={style.outStockNumber}>
            <ShopNumber show value={item.number} />
          </div>
        </div>
      </div>
      <OutProgress
        collectable={collectable}
        notPrepared={notPrepared}
        received={received}
        percent={percent}
        successPercent={successPercent}
      />
      <div hidden={index === dataLength} className={style.space} />
    </div>

  </div>;
};

export default OutSkuItem;
