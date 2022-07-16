import React from 'react';
import style from '../../index.less';
import { Progress } from 'antd';
import { collectableColor, notPreparedColor, receivedColor } from '../../index';
import MyCheck from '../../../../../../../../../../../../components/MyCheck';
import SkuItem from '../../../../../../../../../../../../Work/Sku/SkuItem';
import ShopNumber
  from '../../../../../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';

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

  const received = parseInt(skuItem.receivedNumber || 0);
  const collectable = skuItem.collectable || 0;
  const notPrepared = skuItem.number - collectable - received;

  const successPercent = Number(((received / skuItem.number)).toFixed(2)) * 100;
  const percent = Number(((collectable / skuItem.number)).toFixed(2)) * 100;
  const trail = Number(((notPrepared / skuItem.number)).toFixed(2)) * 100;

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
    <div className={style.dataNumber}>
      <div className={style.number}>
        <div hidden={successPercent <= 0} style={{ width: `${successPercent}%` }}>{received}</div>
        <div hidden={percent <= 0} style={{ width: `${percent}%` }}>{collectable}</div>
        <div hidden={trail <= 0} style={{ width: `${trail}%` }}>{notPrepared}</div>
      </div>
      <Progress
        className={style.progress}
        format={() => {
          return skuItem.number + '  (申请数)';
        }}
        percent={percent + successPercent}
        success={{ percent: successPercent, strokeColor: receivedColor }}
        trailColor={notPreparedColor}
        strokeColor={collectableColor}
      />
    </div>

  </div>;
};

export default OutItem;
