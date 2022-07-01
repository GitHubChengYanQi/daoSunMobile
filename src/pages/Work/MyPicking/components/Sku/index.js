import React, { useEffect, useState } from 'react';
import SkuItem from '../../../Sku/SkuItem';
import MyCheck from '../../../../components/MyCheck';
import style from './index.less';
import ShopNumber from '../../../Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import { useRequest } from '../../../../../util/Request';
import { MyLoading } from '../../../../components/MyLoading';
import { ToolUtil } from '../../../../components/ToolUtil';

const getCarts = { url: '/productionPickListsCart/getSelfCartsBySku', method: 'POST' };

const Sku = (
  {
    value = [],
    refresh,
    allChecked,
    getCount = () => {
    },
    onChange = () => {
    },
  },
) => {

  const [data, setData] = useState([]);

  console.log(data);

  const [checkSku, setCheckSku] = useState([]);

  const skuChange = (newCheckSku) => {
    setCheckSku(newCheckSku);
    const outSkus = [];
    newCheckSku.map(item => {
      return item.orders.map(orderItem => {
        return outSkus.push({
          pickListsId: orderItem.pickListsId,
          skuId: item.skuId,
          outStockNumber: orderItem.outStockNumber,
          brandId: item.brandId,
        });
      });
    });
    onChange(outSkus);
  };

  const { loading, refresh: cartRefresh } = useRequest(getCarts, {
    onSuccess: (res) => {
      const array = ToolUtil.isArray(res);
      const newData = array.map((item, index) => {

        const skuResult = item.skuResult || {};
        const brandResult = item.brandResult || {};

        let orders = [];
        let details = [];

        const pickDetails = item.pickListsCartResults || [];

        pickDetails.map(item => {
          if (details.map(item => item.pickListsDetailId).includes(item.pickListsDetailId)) {
            details = details.map(detailItem => {
              if (detailItem.pickListsDetailId === item.pickListsDetailId) {
                const number = detailItem.outStockNumber + item.number;
                return { ...detailItem, outStockNumber: number, maxNumber: number };
              } else {
                return detailItem;
              }
            });
          } else {
            details.push({ ...item, outStockNumber: item.number, maxNumber: item.number });
          }
          return null;
        });

        details.map(item => {
          if (orders.map(item => item.pickListsId).includes(item.pickListsId)) {
            orders = orders.map(orderItem => {
              if (orderItem.pickListsId === item.pickListsId) {
                const number = orderItem.outStockNumber + item.outStockNumber;
                return {
                  ...orderItem,
                  details: [...orderItem.details, item.productionPickListsDetailResult],
                  outStockNumber: number,
                  maxNumber: number,
                };
              }
              return orderItem;
            });
          } else {
            orders.push({ ...item, details: [item.productionPickListsDetailResult] });
          }
          return null;
        });
        return {
          ...item,
          orders,
          key: index,
          brandId: brandResult.brandId,
          brandResult,
          skuId: skuResult.skuId,
          skuResult,
        };
      });
      setData(newData);
      getCount(array.length);
    },
  });

  const checkSkuChange = (outStockNumber, index, detailIndex) => {
    const newData = data.map((skuItem, skuIndex) => {
      if (skuIndex === index) {
        const orders = skuItem.orders || [];
        const newOrders = orders.map((item, index) => {
          if (index === detailIndex) {
            return { ...item, outStockNumber };
          }
          return item;
        });
        return { ...skuItem, orders: newOrders };
      }
      return skuItem;
    });
    setData(newData);
  };


  useEffect(() => {
    if (allChecked) {
      skuChange(data);
    } else if (value.length === 0) {
      skuChange([]);
    }
  }, [allChecked]);

  useEffect(() => {
    if (refresh) {
      cartRefresh();
      skuChange([]);
    }
  }, [refresh]);

  return <>

    {
      data.map((item, index) => {

        const skuResult = item.skuResult || {};
        const spuResult = skuResult.spuResult || {};
        const unit = spuResult.unitResult || {};

        const orders = ToolUtil.isArray(item.orders);

        const checked = checkSku.map(item => item.key).includes(index);

        return <div key={index} className={style.outSku}>
          <div className={style.skuItem} onClick={() => {
            if (checked) {
              const newCheckSku = checkSku.filter(item => item.key !== index);
              skuChange(newCheckSku);
            } else {
              skuChange([...checkSku, item]);
            }
          }}>
            <span><MyCheck checked={checked} /></span>
            <SkuItem
              skuResult={item.skuResult}
              otherData={[ToolUtil.isObject(item.brandResult).brandName]}
              extraWidth='58px'
            />
          </div>

          {
            orders.map((detailItem, detailIndex) => {

              const details = detailItem.details || [];
              const pickListsResult = detailItem.pickListsResult || {};

              let receivedNumber = 0;
              let number = 0;
              details.map(item => {
                receivedNumber += parseInt(item.receivedNumber);
                number += item.number;
                return null;
              });

              return <div key={detailIndex} className={style.askData}>
                <div className={style.title}>
                  <div className={style.outOrder}>
                    {ToolUtil.isObject(pickListsResult.createUserResult).name}的出库申请
                    / {pickListsResult.coding}
                  </div>
                  <div className={style.time}>
                    {receivedNumber || 0}{unit.unitName} / {number} {unit.unitName}
                  </div>
                </div>
                <div>
                  <ShopNumber
                    value={detailItem.outStockNumber}
                    max={detailItem.maxNumber}
                    onChange={(outStockNumber) => {
                      checkSkuChange(outStockNumber, index, detailIndex);
                      if (checked) {
                        const newCheckSku = checkSku.map(item => {
                          if (item.key === index) {
                            const orders = item.orders || [];
                            const newOrders = orders.map((item, index) => {
                              if (index === detailIndex) {
                                return { ...item, outStockNumber };
                              }
                              return item;
                            });
                            return { ...item, orders: newOrders };
                          }
                          return item;
                        });
                        skuChange(newCheckSku);
                      }
                    }}
                  />
                </div>
              </div>;
            })
          }

        </div>;
      })
    }

    {loading && <MyLoading />}

  </>;
};

export default Sku;
