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
      setData(ToolUtil.isArray(res).map(item => {
        const cartResults = item.cartResults || [];
        const newCarts = cartResults.map((item) => {
          count++;
          return { ...item, maxNumber: item.number };
        });
        return { ...item, cartResults: newCarts };
      }));
      getCount(count);
    },
  });


  useEffect(() => {
    if (allChecked) {
      const newOutSkus = [];
      data.map(item => {
        const cartResults = item.cartResults || [];
        return cartResults.map(item => newOutSkus.push(item));
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

  const outSkusChange = (newOutSkus) => {
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

  const detailChange = (number, itemId, orderId) => {
    const newData = data.map((item) => {
      if (item.pickListsId === orderId) {
        const cartResults = item.cartResults || [];
        const newCarts = cartResults.map((item) => {
          if (item.pickListsCart === itemId) {
            return { ...item, number };
          }
          return item;
        });
        return { ...item, cartResults: newCarts };
      }
      return item;
    });
    setData(newData);
  };

  return <>

    {
      data.map((item, index) => {
        const cartResults = item.cartResults || [];
        const checkCarts = value.filter(outItem => outItem.pickListsId === item.pickListsId);

        const orderChecked = checkCarts.length === cartResults.length;

        return <div key={index} className={style.orderItem} hidden={cartResults.length === 0}>
          <div className={style.data}>
            <div className={style.customer}>
              <MyCheck checked={orderChecked} fontSize={18} onChange={(checked) => {
                const newOutSkus = value.filter(skuItem => skuItem.pickListsId !== item.pickListsId);
                if (checked) {
                  outSkusChange([...newOutSkus, ...cartResults]);
                } else {
                  outSkusChange(newOutSkus);
                }
              }} />{ToolUtil.isObject(item.createUserResult).name}的出库申请 / {item.coding} <RightOutline
              style={{ color: '#B9B9B9' }} />
            </div>
            <div className={style.status} style={{ color: '#555555' }}>
              备料人:{ToolUtil.isObject(item.userResult).name}
            </div>
          </div>
          {
            cartResults.map((skuItem, skuIndex) => {

              const createTime = new Date(skuItem.createTime.replaceAll('-','/'));

              const cartChecked = checkCarts.map(item => item.pickListsCart).includes(skuItem.pickListsCart);

              if (!item.allSku && skuIndex > 2) {
                return null;
              }

              return <div key={skuIndex} className={style.skus}>
                <span className={style.checked}>
                  <MyCheck
                    checked={cartChecked}
                    fontSize={18}
                    onChange={(checked) => {
                      if (checked) {
                        outSkusChange([...value, skuItem]);
                      } else {
                        outSkusChange(value.filter(outItem => outItem.pickListsCart !== skuItem.pickListsCart));
                      }
                    }}
                  />
                </span>
                <div className={style.skuItem}>
                  <SkuItem
                    imgSize={60}
                    skuResult={skuItem.skuResult}
                    extraWidth='158px'
                    otherData={ToolUtil.isObject(skuItem.brandResult).brandName}
                  />
                </div>
                <div className={style.skuData} style={{ width: 100, maxWidth: 100 }}>
                  <div className={style.time}>
                    <div className={style.left}>{createTime.getMonth() + 1}</div>
                    <div className={style.slash} />
                    <div className={style.right}>{createTime.getDate()}</div>
                  </div>
                  <div className={style.skuDataMoney}>
                    <ShopNumber value={skuItem.number} max={skuItem.maxNumber} onChange={(number) => {
                      detailChange(number, skuItem.pickListsCart, item.pickListsId);
                      if (cartChecked) {
                        const newOutSkus = value.map(item => {
                          if (item.pickListsCart === skuItem.pickListsCart) {
                            return { ...item, number };
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
          {cartResults.length > 3 && <Divider className={style.allSku}>
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
