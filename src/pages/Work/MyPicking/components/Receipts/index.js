import React, { useEffect, useState } from 'react';
import style from '../../../Instock/InstockAsk/coponents/ReceiptsInstock/components/PurchaseOrder/index.less';
import { ToolUtil } from '../../../../components/ToolUtil';
import { DownOutline, ExclamationCircleOutline, RightOutline, UpOutline } from 'antd-mobile-icons';
import SkuItem from '../../../Sku/SkuItem';
import { Divider } from 'antd-mobile';
import ShopNumber from '../../../Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import MyCheck from '../../../../components/MyCheck';
import { useRequest } from '../../../../../util/Request';
import { MyLoading } from '../../../../components/MyLoading';
import MyEmpty from '../../../../components/MyEmpty';
import { history } from 'umi';
import { ReceiptsEnums } from '../../../../Receipts';

const getCarts = { url: '/productionPickListsCart/getSelfCartsByLists', method: 'POST' };

const Receipts = (
  {
    getCount = () => {
    },
    onChange = () => {

    },
    allChecked,
    refresh,
    value = [],
  },
) => {

  const [data, setData] = useState([]);

  const { loading, refresh: cartRefresh } = useRequest(getCarts, {
    onSuccess: (res) => {
      let count = 0;
      const newData = [];
      ToolUtil.isArray(res).map(item => {

        const detailResults = item.detailResults || [];

        const carts = item.cartResults || [];
        const newCarts = carts.map((skuItem,index) => {
          const detail = detailResults.filter(item => (item.skuId === skuItem.skuId) && (skuItem.brandId ? item.brandId === skuItem.brandId : true));
          count++;
          return {
            ...skuItem,
            outStockNumber: skuItem.number,
            cartNumber: skuItem.number,
            key: item.pickListsId + skuItem.skuId + skuItem.brandId+index,
            receivedNumber: ToolUtil.isObject(detail[0]).receivedNumber || 0,
            number: ToolUtil.isObject(detail[0]).number ||0,
          };
        });
        if (newCarts.length > 0) {
          newData.push({ ...item, carts: newCarts });
        }
        return null;
      });
      setData(newData);
      getCount(count);
    },
  });


  useEffect(() => {
    if (allChecked) {
      const newOutSkus = [];
      data.map(item => {
        const carts = item.carts || [];
        return carts.map(item => newOutSkus.push(item));
      });
      outSkusChange(newOutSkus);
    }
  }, [allChecked]);

  useEffect(() => {
    if (refresh) {
      cartRefresh();
      outSkusChange([]);
    }
  }, [refresh]);

  const outSkusChange = (newOutSkus = []) => {
    onChange(newOutSkus);
  };

  const dataChange = (dataItem, itemIndex) => {
    const newData = data.map((item, index) => {
      if (index === itemIndex) {
        return { ...item, ...dataItem };
      }
      return item;
    });
    setData(newData);
  };

  const detailChange = (outStockNumber, key, orderId) => {
    const newData = data.map((item) => {
      if (item.pickListsId === orderId) {
        const carts = item.carts || [];
        const newCarts = carts.map((item) => {
          if (item.key === key) {
            return { ...item, outStockNumber };
          }
          return item;
        });
        return { ...item, carts: newCarts };
      }
      return item;
    });
    setData(newData);
  };

  const checkChange = (checked, skuItem) => {
    if (!checked) {
      outSkusChange([...value, skuItem]);
    } else {
      outSkusChange(value.filter(outItem => outItem.key !== skuItem.key));
    }
  };

  return <>
    {data.length === 0 && <MyEmpty />}
    {
      data.map((item, index) => {
        const carts = item.carts || [];
        const checkCarts = value.filter(outItem => outItem.pickListsId === item.pickListsId);

        const orderChecked = checkCarts.length === carts.length;

        return <div key={index} className={style.orderItem}>
          <div className={style.data}>
            <div className={style.customer}>
              <MyCheck checked={orderChecked} fontSize={18} onChange={(checked) => {
                const newOutSkus = value.filter(skuItem => skuItem.pickListsId !== item.pickListsId);
                if (checked) {
                  outSkusChange([...newOutSkus, ...carts]);
                } else {
                  outSkusChange(newOutSkus);
                }
              }} />
              <span onClick={() => {
                history.push(`/Receipts/ReceiptsDetail?type=${ReceiptsEnums.outstockOrder}&formId=${item.pickListsId}`);
              }}>{ToolUtil.isObject(item.createUserResult).name}的出库申请 / {item.coding} <RightOutline
                style={{ color: '#B9B9B9' }} /></span>
            </div>
            <div className={style.status} style={{ color: '#555555' }}>
              备料人：{ToolUtil.isObject(item.userResult).name}
            </div>
          </div>
          {
            carts.map((skuItem, skuIndex) => {

              const cartChecked = checkCarts.map(item => item.key).includes(skuItem.key);

              const skuResut = skuItem.skuResult || {};
              const spuResult = skuResut.spuResult || {};
              const unit = spuResult.unitResult || {};

              if (!item.allSku && skuIndex > 2) {
                return null;
              }

              return <div key={skuIndex} className={style.skus}>
                <span className={style.checked} onClick={() => {
                  checkChange(cartChecked, skuItem);
                }}>
                  <MyCheck
                    checked={cartChecked}
                    fontSize={18}
                  />
                </span>
                <div className={style.skuItem} onClick={() => {
                  checkChange(cartChecked, skuItem);
                }}>
                  <SkuItem
                    imgSize={60}
                    skuResult={skuItem.skuResult}
                    extraWidth='158px'
                    otherData={ToolUtil.isObject(skuItem.brandResult).brandName}
                  />
                </div>
                <div className={style.skuData} style={{ width: 100, maxWidth: 100 }}>
                  <div className={style.time}>
                    <div className={style.left}>{skuItem.receivedNumber || 0}{unit.unitName}</div>
                    <div className={style.slash} />
                    <div className={style.right}>{skuItem.number || 0} {unit.unitName}</div>
                  </div>
                  <div className={style.skuDataMoney}>
                    <ShopNumber value={skuItem.outStockNumber} max={skuItem.cartNumber} onChange={(outStockNumber) => {
                      detailChange(outStockNumber, skuItem.key, item.pickListsId);
                      if (cartChecked) {
                        const newOutSkus = value.map(item => {
                          if (item.key === skuItem.key) {
                            return { ...item, outStockNumber };
                          }
                          return item;
                        });
                        outSkusChange(newOutSkus);
                      }
                    }} />
                  </div>
                </div>
              </div>;
            })
          }
          {carts.length > 3 && <Divider className={style.allSku}>
            <div onClick={() => {
              dataChange({ allSku: !item.allSku }, index);
            }}>
              {
                item.allSku ?
                  <UpOutline />
                  :
                  <DownOutline />
              }
            </div>
          </Divider>}
          <div className={style.data}>
            <span
              className={style.icon}><ExclamationCircleOutline /></span>{ToolUtil.isArray(item.announcementsResults).map(item => item.content).join('、')}
          </div>
        </div>;
      })
    }

    {loading && <MyLoading />}
  </>;
};

export default Receipts;
