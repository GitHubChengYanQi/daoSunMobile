import React, { useEffect, useState } from 'react';
import style from '../../index.less';
import SkuItem from '../../../../../../../../Sku/SkuItem';
import { ToolUtil } from '../../../../../../../../../components/ToolUtil';
import { Button } from 'antd-mobile';
import ShopNumber from '../../../ShopNumber';
import AllBrands from './components/AllBrands';
import StoreHouses from './components/StoreHouses';
import AllocationSteps
  from '../../../../../../Submit/components/InstockSkus/components/AllocationAsk/components/AllocationSteps';
import FixedBrand from './components/FixedBrand';
import { useRequest } from '../../../../../../../../../../util/Request';
import { getPositionsAndBrands } from '../../../../../../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/OutStockOrder/components/Prepare/components/Order';
import { MyLoading } from '../../../../../../../../../components/MyLoading';
import MyEmpty from '../../../../../../../../../components/MyEmpty';

const AllocationAdd = (
  {
    onClose = () => {
    },
    sku = {},
    query = {},
    addShop = () => {
    },
    shopEdit = () => {
    },
    noSteps,
  },
) => {

  const out = query.allocationType === 'out';
  const storehouseId = query.storeHouseId;
  const moveLibrary = query.askType === 'moveLibrary';

  const allocationJson = sku.allocationJson || {};
  const start = allocationJson.start || {};
  const end = allocationJson.end || {};

  const [brandAndPositions, setBrandAndPositions] = useState(start.brands || []);

  const [storeHouse, setStoreHouse] = useState(end.storeHouse || []);

  const [total, setTotal] = useState(sku.number || 0);

  const [brandAction, setBrandAction] = useState(moveLibrary ? 'allBrand' : (start.brandType || 'fixedBrand'));

  const {
    loading: outPositionLoaidng,
    data: outPositionData,
    run: getOutPosition,
  } = useRequest(getPositionsAndBrands, {
    manual: true,
  });

  useEffect(() => {
    if (out) {
      getOutPosition({ data: { skuId: sku.skuId, storehouseId } });
    }
  }, [sku.skuId]);

  const selectBrandAndPositions = () => {
    if (outPositionLoaidng) {
      return <MyLoading skeleton />;
    }
    if (out && ToolUtil.isArray(outPositionData).length === 0) {
      return <MyEmpty description='暂无库存' />;
    }
    switch (brandAction) {
      case 'fixedBrand':
        return <FixedBrand
          storehouseName={query.storeHouse}
          out={out}
          outPositionData={outPositionData}
          sku={sku}
          storehouseId={storehouseId}
          value={brandAndPositions}
          onChange={(value = []) => {
            let total = 0;
            value.forEach(item => {
              if (!item.show) {
                return;
              }
              total += (item.number || 0);
            });
            setBrandAndPositions(value);
            setTotal(total);
            setStoreHouse([]);
          }} />;
      case 'allBrand':
        return <AllBrands
          positionsResult={sku.positionsResult || []}
          outPositionData={outPositionData}
          out={out}
          value={brandAndPositions}
          storehouseName={query.storeHouse}
          stotrhouseId={storehouseId}
          skuId={sku.skuId}
          onChange={(value = []) => {
            let total = 0;
            value.forEach(item => {
              if (!item.checked) {
                return;
              }
              total += item.outStockNumber || 0;
            });
            setBrandAndPositions(value.length > 0 ? [{
              brandId: null,
              brandName: '任意品牌',
              number: total,
              positions: value,
              show: true,
            }] : []);
            setTotal(total);
            setStoreHouse([]);
          }} />;
      default:
        return <></>;
    }
  };

  return <>
    {!noSteps && <AllocationSteps current={1} />}
    <div className={style.addSku} style={{ padding: 0 }}>
      <SkuItem
        className={style.sku}
        number={sku.stockNumber}
        imgId='skuImg'
        skuResult={sku}
        imgSize={80}
        otherData={[ToolUtil.isArray(sku.brandResults).map(item => item.brandName).join(' / ')]}
        extraWidth={'calc(25vw + 24px)'}
      />
      <div className={style.content}>
        <div className={style.brandAction}>
          {
            moveLibrary ?' 调出库位' : <>
              <div className={style.brandData}>
                品牌：
                <Button color={brandAction === 'fixedBrand' ? 'primary' : 'default'} onClick={() => {
                  setTotal(0);
                  setBrandAndPositions([]);
                  setBrandAction('fixedBrand');
                  setStoreHouse([]);
                }}>指定品牌</Button>
                <Button color={brandAction === 'allBrand' ? 'primary' : 'default'} onClick={() => {
                  setTotal(0);
                  setBrandAndPositions([]);
                  setBrandAction('allBrand');
                  setStoreHouse([]);
                }}>任意品牌</Button>
              </div>
              <div className={style.total}>
                调拨总数：<ShopNumber
                max={out ? sku.stockNumber : undefined}
                show={total > 0}
                value={total}
                onChange={(number) => {
                  setTotal(number);
                }} />
              </div>
            </>
          }
        </div>
        <div className={style.brandAndPositions}>
          {selectBrandAndPositions()}
        </div>
        <div hidden={total === 0} style={{ marginTop: 24 }}>
          <StoreHouses
            total={total}
            skuId={sku.skuId}
            brandAndPositions={brandAndPositions}
            out={out}
            data={storeHouse}
            onChange={setStoreHouse}
            storehouseId={storehouseId}
          />
        </div>
      </div>

      <div className={style.buttons} style={{ margin: 0 }}>
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
          disabled={total === 0}
          onClick={() => {
            const data = {
              skuId: sku.skuId,
              number: total,
              storehouseId,
              allocationJson: {
                'start': {
                  'brandType': brandAction,
                  'brands': brandAndPositions.map(item => {
                    const positions = item.positions || [];
                    return {
                      'brandId': item.brandId,
                      'brandName': item.brandName,
                      'num': item.num,
                      'number': item.number,
                      'show': item.show,
                      'positions': positions.map(item => {
                        return {
                          'id': item.id,
                          'name': item.name,
                          'storehouseId': item.storehouseId,
                          'number': item.number,
                          'outStockNumber': item.outStockNumber,
                          'checked': item.checked,
                        };
                      }),
                    };
                  }),
                },
                'end': {
                  'storeHouse': storeHouse.map(item => {
                    const brands = item.brands || [];
                    const positions = item.positions || [];
                    return {
                      'number': item.number,
                      'maxNumber': item.maxNumber,
                      'id': item.id,
                      'name': item.name,
                      'show': item.show,
                      'positions': positions.map(item => {
                        const brands = item.brands || [];
                        return {
                          'id': item.id,
                          'name': item.name,
                          'storehouseId': item.storehouseId,
                          'number': item.number,
                          'maxNumber': item.maxNumber,
                          'brands': brands.map(item => {
                            return {
                              'checked': item.checked,
                              'brandId': item.brandId,
                              'maxNumber': item.maxNumber,
                              'number': item.number,
                              'brandName': item.brandName,
                            };
                          }),
                        };
                      }),
                      'brands': brands.map(item => {
                        return {
                          'checked': item.checked,
                          'brandId': item.brandId,
                          'number': item.number,
                          'brandName': item.brandName,
                          'maxNumber': item.maxNumber,
                        };
                      }),
                    };
                  }),
                },
              },
            };
            if (sku.cartId) {
              shopEdit({ ...data, cartId: sku.cartId });
              return;
            }
            addShop(data);
          }}>
          {sku.cartId ? '修改' : '添加'}
        </Button>
      </div>
    </div>
  </>;
};

export default AllocationAdd;
