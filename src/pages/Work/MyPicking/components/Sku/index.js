import React, { useEffect, useState } from 'react';
import SkuItem from '../../../Sku/SkuItem';
import MyCheck from '../../../../components/MyCheck';
import style from './index.less';
import ShopNumber from '../../../Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import { useRequest } from '../../../../../util/Request';
import { MyLoading } from '../../../../components/MyLoading';
import Slash from '../Slash';
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

  const [checkSku, setCheckSku] = useState([]);

  const skuChange = (newCheckSku) => {
    setCheckSku(newCheckSku);
    onChange(newCheckSku);
  };

  const { loading, refresh: cartRefresh } = useRequest(getCarts, {
    onSuccess: (res) => {
      let count = 0;
      const newData = [];
      ToolUtil.isArray(res).map(item => {
        const skuResults = item.skuResults || [];
        const storehouseResult = item.storehouseResult || {};
        newData.push({
          ...item,
          key: storehouseResult.storehouseId,
          skuResults: skuResults.map(item => {
            return {
              ...item,
              key: item.skuId + storehouseResult.storehouseId,
              storehouseId: storehouseResult.storehouseId,
            };
          }),
        });
        return count += skuResults.length;
      });
      setData(newData);
      getCount(count);
    },
  });


  useEffect(() => {
    if (allChecked) {
      const newSku = [];
      data.map(item => {
        const skuResults = item.skuResults || [];
        return skuResults.map(item => {
          return newSku.push(item);
        });
      });
      skuChange(newSku);
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

  const checkSkuKey = checkSku.map(item => item.key);

  return <>

    {
      data.map((item, index) => {

        const skuResults = item.skuResults || [];
        const storehouseResult = item.storehouseResult || {};

        const skuKeys = skuResults.map(item => item.key);

        const checkSkus = skuKeys.filter(item => checkSkuKey.includes(item));

        const checked = checkSkus.length === skuResults.length;

        return <div key={index} className={style.outSku}>
          <div className={style.skuItem} onClick={() => {
            if (checked) {
              const newCheckSku = checkSku.filter(item => !skuKeys.includes(item.key));
              skuChange(newCheckSku);
            } else {
              skuChange([...checkSku, ...skuResults]);
            }
          }}>
            <span><MyCheck checked={checked} /></span>
            <div className={style.storeName}>{storehouseResult.name}</div>
          </div>

          {
            skuResults.map((skuItem, skuIndex) => {

              const cartResults = skuItem.cartResults || [];

              let receivedNumber = 0;
              let number = 0;
              let perpareNumber = 0;

              cartResults.map(item => {
                const detail = item.productionPickListsDetailResult || {};
                receivedNumber += parseInt(detail.receivedNumber || 0);
                number += (detail.number || 0);
                perpareNumber += (item.number || 0);
                return null;
              });

              let numberColor = '';
              const total = perpareNumber + receivedNumber;
              if (perpareNumber === 0) {
                numberColor = 'var(--adm-color-danger)';
              } else if (total === number) {
                numberColor = '#40FF00';
              } else if (total < number) {
                numberColor = 'var(--adm-color-primary)';
              }

              const skuChecked = checkSkuKey.includes(skuItem.key);

              return <div key={skuIndex} className={style.skus}>
                <div className={style.skuItem} onClick={() => {
                  if (skuChecked) {
                    skuChange(checkSku.filter(item => item.key !== skuItem.key));
                  } else {
                    skuChange([...checkSku, skuItem]);
                  }
                }}>
                  <MyCheck checked={skuChecked} />
                  <div className={style.sku}>
                    <SkuItem
                      skuResult={skuItem}
                      extraWidth='58px'
                    />
                  </div>
                  <div className={style.skuData}>
                    <Slash rightText={number} leftText={receivedNumber} rightStyle={{ color: numberColor }} />
                    {perpareNumber ? <ShopNumber show value={perpareNumber} /> : ''}
                  </div>
                </div>

                {
                  cartResults.map((detailItem, detailIndex) => {
                    const detail = detailItem.productionPickListsDetailResult || {};
                    const pickListsResult = detail.pickListsResult || {};
                    return <div key={detailIndex} className={style.askData}>
                      <div className={style.title}>
                        <div className={style.outOrder}>
                          {ToolUtil.isObject(pickListsResult.createUserResult).name}的出库申请
                          /
                          {pickListsResult.coding}
                        </div>
                        <div className={style.time}>
                          {detail.receivedNumber || 0} / {detail.number}
                        </div>
                      </div>
                      <div>
                        <ShopNumber
                          show
                          value={detailItem.number}
                        />
                      </div>
                    </div>;
                  })
                }

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
