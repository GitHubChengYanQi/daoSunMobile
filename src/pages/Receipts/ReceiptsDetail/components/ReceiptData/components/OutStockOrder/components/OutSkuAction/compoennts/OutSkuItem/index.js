import React from 'react';
import style
  from '../../../../../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import { ToolUtil } from '../../../../../../../../../../components/ToolUtil';
import SkuItem from '../../../../../../../../../../Work/Sku/SkuItem';
import { Progress } from 'antd';
import { collectableColor, notPreparedColor, receivedColor } from '../MyPicking';
import pickStyle from '../MyPicking/index.less';
import ShopNumber
  from '../../../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';

const OutSkuItem = ({ item, dataLength, index }) => {
  const skuResult = item.skuResult || {};

  const received = item.receivedNumber;
  const collectable = item.perpareNumber;
  const notPrepared = item.number - collectable - received;

  const successPercent = Number(((received / item.number)).toFixed(2)) * 100;
  const percent = Number(((collectable / item.number)).toFixed(2)) * 100;

  return <div className={style.out}>
    <div className={ToolUtil.classNames(style.statusName, !item.stockNumber && style.noStatusName)}>
      {item.stockNumber ? <>可 <br />备 <br />料</> : <>不 <br />可 <br />备 <br />料</>}
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
                ToolUtil.isArray(item.positionNames).join('、')
              ]}
            />
          </div>
          <div className={style.outStockNumber}>
            <ShopNumber show value={item.number} />
          </div>
        </div>
      </div>
      <div className={pickStyle.dataNumber}>
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
          <div className={style.statusItem} style={{ margin: 0 }}>
            <div className={style.radius} style={{ backgroundColor: receivedColor }} />
            已领 {received}
          </div>
          <div className={style.statusItem}>
            <div className={style.radius} style={{ backgroundColor: collectableColor }} />
            可领 {collectable}
          </div>
          <div className={style.statusItem}>
            <div className={style.radius} style={{ backgroundColor: notPreparedColor }} />
            未备 {notPrepared}
          </div>
        </div>
      </div>
      <div hidden={index === dataLength} className={style.space} />
    </div>

  </div>;
};

export default OutSkuItem;
