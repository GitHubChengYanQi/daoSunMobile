import React, { useState } from 'react';
import style from '../../index.less';
import SkuItem from '../../../../../../../../Sku/SkuItem';
import { ToolUtil } from '../../../../../../../../../components/ToolUtil';
import { Button } from 'antd-mobile';
import Order
  from '../../../../../../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/OutStockOrder/components/Prepare/components/Order';
import ShopNumber from '../../../ShopNumber';
import AllBrands from './components/AllBrands';
import StoreHouses from './components/StoreHouses';
import AllocationSteps
  from '../../../../../../Submit/components/InstockSkus/components/AllocationAsk/components/AllocationSteps';
import FixedBrand from './components/FixedBrand';

const AllocationAdd = (
  {
    onClose = () => {
    },
    sku = {},
    query = {},
  },
) => {

  const out = query.allocationType === 'out';

  const [brandAndPositions, setBrandAndPositions] = useState([]);
  console.log(brandAndPositions);

  const [storeHouse, setStoreHouse] = useState([]);
  console.log(storeHouse);

  const [total, setTotal] = useState(0);

  const [brandAction, setBrandAction] = useState('fixedBrand');

  const selectBrandAndPositions = () => {
    switch (brandAction) {
      case 'fixedBrand':
        return out ? <Order
            out={out}
            storehouseId={query.storeHouseId}
            className={style.fixedBrand}
            brandShow
            skuId={sku.skuId}
            onChange={(value = []) => {
              let total = 0;
              setBrandAndPositions(value.map(item => {
                total += item.number || 0;
                return {
                  skuId: item.skuId,
                  brandId: item.brandId,
                  number: item.number,
                  storehouseId: item.storehouseId,
                  storehousePositionsId: item.storehousePositionsId,
                };
              }));
              setTotal(total);
            }} /> :
          <FixedBrand
            sku={sku}
            stotrhouseId={query.storeHouseId}
            onChange={(value = []) => {
              let total = 0;
              const array = [];
              value.forEach(item => {
                total += item.number || 0;
                const positions = item.positions || [];
                positions.forEach(positionItem => {
                  total += positionItem.number;
                  array.push({
                    skuId: sku.skuId,
                    brandId: item.brandId,
                    number: positionItem.number,
                    storehouseId: positionItem.storehouseId,
                    storehousePositionsId: positionItem.storehousePositionsId,
                  });
                });
              });
              setBrandAndPositions(array);
              setTotal(total);
            }}
          />;
      case 'allBrand':
        return <AllBrands
          positionsResult={sku.positionsResult}
          out={out}
          stotrhouseId={query.storeHouseId}
          skuId={sku.skuId}
          onChange={(value = []) => {
            let total = 0;
            setBrandAndPositions(value.map(item => {
              total += item.number || 0;
              return {
                skuId: sku.skuId,
                brandId: 0,
                number: item.number,
                storehouseId: item.storehouseId,
                storehousePositionsId: item.id,
              };
            }));
            setTotal(total);
          }} />;
      default:
        return <></>;
    }
  };

  return <>
    <AllocationSteps current={1} />
    <div className={style.addSku}>
      <SkuItem
        number={sku.stockNumber}
        imgId='skuImg'
        skuResult={sku}
        imgSize={80}
        otherData={[ToolUtil.isArray(sku.brandResults).map(item => item.brandName).join(' / ')]}
        extraWidth={'calc(25vw + 24px)'}
      />
      <div className={style.brandAction}>
        <div className={style.brandData}>
          品牌：
          <Button className={brandAction === 'fixedBrand' ? style.checkBrand : ''} onClick={() => {
            setTotal(0);
            setBrandAndPositions([]);
            setBrandAction('fixedBrand');
          }}>指定品牌</Button>
          <Button className={brandAction === 'allBrand' ? style.checkBrand : ''} onClick={() => {
            setTotal(0);
            setBrandAndPositions([]);
            setBrandAction('allBrand');
          }}>任意品牌</Button>
        </div>
        <div className={style.total}>
          调拨总数：<ShopNumber
          max={out ? sku.stockNumber : undefined}
          show={brandAndPositions.length > 0}
          value={total}
          onChange={(number) => {
            setTotal(number);
          }} />
        </div>
      </div>
      <div className={style.brandAndPositions}>
        {selectBrandAndPositions()}
      </div>

      <div className={style.storeHouseTitle}>
        指定调{out ? '入' : '出'}库（位）
      </div>

      <StoreHouses
        skuId={sku.skuId}
        out={out}
        value={storeHouse}
        onChange={setStoreHouse}
        stotrhouseId={query.storeHouseId}
      />

      <div className={style.buttons}>
        <Button
          className={ToolUtil.classNames(style.close, style.button)}
          onClick={() => {
            onClose();
          }}>
          取消
        </Button>
        <Button
          className={ToolUtil.classNames(style.ok, style.button)}
          color='primary'
          onClick={() => {

          }}>
          添加
        </Button>
      </div>
    </div>
  </>;
};

export default AllocationAdd;
