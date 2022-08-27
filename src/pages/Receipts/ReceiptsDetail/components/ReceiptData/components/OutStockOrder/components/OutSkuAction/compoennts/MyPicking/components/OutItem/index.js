import React from 'react';
import style from '../../index.less';
import { Progress } from 'antd';
import { collectableColor, notPreparedColor, receivedColor } from '../../index';
import MyCheck from '../../../../../../../../../../../../components/MyCheck';
import SkuItem from '../../../../../../../../../../../../Work/Sku/SkuItem';
import ShopNumber
  from '../../../../../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import { OutProgress } from '../../../OutSkuItem';

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
    <OutProgress
      collectable={collectable}
      notPrepared={notPrepared}
      received={received}
      percent={percent}
      successPercent={successPercent}
    />

  </div>;
};

export default OutItem;
