import React, { useState } from 'react';
import style from './index.less';
import SkuItem from '../../../../Sku/SkuItem';
import { ToolUtil } from '../../../../../components/ToolUtil';
import BottomButton from '../../../../../components/BottomButton';
import ShopNumber from '../../../../Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import StoreHouses
  from '../../../../Instock/InstockAsk/coponents/SkuInstock/components/AddSku/components/AllocationAdd/components/StoreHouses';

export const allocationCartAdd = { url: '/allocationCart/add', method: 'POST' };

const Distribution = (
  {
    skuItem,
    out,
    onClose = () => {
    },
    refresh = () => {
    },
  },
) => {

  console.log(skuItem);

  const [storeHouse, setStoreHouse] = useState(skuItem.storeHouse || []);

  return <div className={style.content}>
    <div className={style.skuItem}>
      <SkuItem
        extraWidth='124px'
        className={style.sku}
        skuResult={skuItem.skuResult}
        otherData={[ToolUtil.isObject(skuItem.brandResult).brandName || '任意品牌']}
      />
      <ShopNumber show value={skuItem.number} />
    </div>

    <StoreHouses
      total={skuItem.number}
      skuId={skuItem.skuId}
      brandAndPositions={skuItem.brands}
      out={out}
      data={storeHouse}
      onChange={setStoreHouse}
      storehouseId={skuItem.storehouseId}
    />


    <BottomButton
      leftOnClick={onClose}
      rightOnClick={() => {

      }}
    />
  </div>;
};

export default Distribution;
