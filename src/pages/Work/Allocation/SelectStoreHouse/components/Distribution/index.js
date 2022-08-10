import React, { useState } from 'react';
import style from './index.less';
import SkuItem from '../../../../Sku/SkuItem';
import BottomButton from '../../../../../components/BottomButton';
import ShopNumber from '../../../../Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import StoreHouses
  from '../../../../Instock/InstockAsk/coponents/SkuInstock/components/AddSku/components/AllocationAdd/components/StoreHouses';
import { useRequest } from '../../../../../../util/Request';
import { Message } from '../../../../../components/Message';
import { MyLoading } from '../../../../../components/MyLoading';

export const allocationCartAdd = { url: '/allocationCart/add', method: 'POST' };
export const allocationCartUpdate = { url: '/allocationCart/edit', method: 'POST' };

const Distribution = (
  {
    skuItem,
    out,
    onClose = () => {
    },
    refresh = () => {
    },
    allocationId,
  },
) => {

  const brands = skuItem.brands || [];

  const [storeHouse, setStoreHouse] = useState(skuItem.storeHouse || []);

  const { loading, run } = useRequest(allocationCartAdd, {
    manual: true,
    onSuccess: () => {
      Message.successToast('分配成功！', () => {
        refresh();
      });
    },
  });

  const { loading: editLoading, run: edit } = useRequest(allocationCartUpdate, {
    manual: true,
    onSuccess: () => {
      Message.successToast('重新分配成功！', () => {
        refresh();
      });
    },
  });

  return <div className={style.content}>
    <div className={style.skuItem}>
      <SkuItem
        extraWidth='124px'
        className={style.sku}
        skuResult={skuItem.skuResult}
        otherData={[
          skuItem.haveBrand ? brands.map(item => item.brandName || '无品牌').join(' / ') : '任意品牌',
        ]}
      />
      <ShopNumber show value={skuItem.number} />
    </div>

    <div className={style.storehouse}>
      <StoreHouses
        total={skuItem.number}
        skuId={skuItem.skuId}
        brandAndPositions={skuItem.brands}
        out={out}
        open
        data={storeHouse}
        onChange={setStoreHouse}
        storehouseId={skuItem.storehouseId}
      />
    </div>


    <BottomButton
      leftOnClick={onClose}
      rightText={skuItem.edit ? '重新分配' : '分配'}
      rightOnClick={() => {
        const allocationCartParams = [];
        storeHouse.forEach(storeItem => {
          if (storeItem.show) {
            if (storeItem.id === skuItem.storehouseId) {
              const positions = storeItem.positions || [];
              positions.forEach(positionItem => {
                const brands = positionItem.brands || [];
                brands.forEach(brandItem => {
                  if (brandItem.checked) {
                    allocationCartParams.push({
                      skuId: skuItem.skuId,
                      brandId: brandItem.brandId,
                      storehousePositionsId: positionItem.id,
                      storehouseId: storeItem.id,
                      number: brandItem.number,
                    });
                  }
                });
              });
            } else {
              const brands = storeItem.brands || [];
              brands.forEach(brandItem => {
                if (brandItem.checked) {
                  allocationCartParams.push({
                    skuId: skuItem.skuId,
                    brandId: brandItem.brandId,
                    storehouseId: storeItem.id,
                    number: brandItem.number,
                  });
                }
              });
            }
          }
        });
        if (skuItem.edit) {
          edit({ data: { allocationId, skuId: skuItem.skuId, allocationCartParams, type: 'carry' } });
          return;
        }
        run({ data: { allocationId, allocationCartParams } });
      }}
    />

    {(loading || editLoading) && <MyLoading />}
  </div>;
};

export default Distribution;
