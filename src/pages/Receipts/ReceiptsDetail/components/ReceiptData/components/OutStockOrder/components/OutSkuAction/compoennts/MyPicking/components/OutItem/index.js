import React from 'react';
import style from '../../index.less';
import { Progress } from 'antd';
import { collectableColor, notPreparedColor, receivedColor } from '../../index';
import MyCheck from '../../../../../../../../../../../../components/MyCheck';
import SkuItem from '../../../../../../../../../../../../Work/Sku/SkuItem';
import ShopNumber
  from '../../../../../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import pickStyle from '../../index.less';

const OutItem = (
  {
    skuItem,
    skuIndex,
    action,
    dataChange = () => {
    },
  },
) => {

  const skuChecked = skuItem.checked;

  const received = Number(skuItem.receivedNumber) || 0;
  const collectable = Number(skuItem.collectable) || 0;
  const notPrepared = Number(skuItem.number - collectable - received) || 0;

  const successPercent = Number(((received / skuItem.number)).toFixed(2)) * 100;
  const percent = Number(((collectable / skuItem.number)).toFixed(2)) * 100;

  return <div key={skuIndex} className={style.skus}>
    <div className={style.skuItem}>
      <div hidden={!action}>
        <MyCheck checked={skuChecked} onChange={() => {
          dataChange(skuItem.key, { checked: !skuChecked });
        }} />
      </div>
      <div className={style.sku}>
        <SkuItem
          skuResult={skuItem.skuResult}
          extraWidth='58px'
          otherData={[skuItem.brandResult ? skuItem.brandResult.brandName : '任意品牌']}
        />
      </div>
      <div className={style.skuData}>
        <ShopNumber max={collectable} min={1} value={skuItem.outNumber} onChange={(outNumber) => {
          dataChange(skuItem.key, { outNumber });
        }} />
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

  </div>;
};

export default OutItem;
