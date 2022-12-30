import React, { useEffect, useState } from 'react';
import style from '../../../Instock/InstockAsk/coponents/ReceiptsInstock/components/PurchaseOrder/index.less';
import { ToolUtil } from '../../../../../util/ToolUtil';
import { DownOutline, ExclamationCircleOutline, RightOutline, UpOutline } from 'antd-mobile-icons';
import SkuItem from '../../../Sku/SkuItem';
import { Divider } from 'antd-mobile';
import ShopNumber from '../../../AddShop/components/ShopNumber';
import MyCheck from '../../../../components/MyCheck';
import { useRequest } from '../../../../../util/Request';
import { MyLoading } from '../../../../components/MyLoading';
import MyEmpty from '../../../../components/MyEmpty';
import { history } from 'umi';
import { ReceiptsEnums } from '../../../../Receipts';
import Slash from '../Slash';
import outStockLogo from '../../../../../assets/outStockLogo.png';
import makeStyle from '../../../Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';

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
      const newData = ToolUtil.isArray(res).map(item => {

        const detailResults = item.detailResults || [];

        const newDetails = [];

        detailResults.map(item => {
          const carts = item.cartResults || [];
          let perpareNumber = 0;
          const brandIds = [];
          carts.map(item => {
            if (!brandIds.includes(item.brandId)) {
              brandIds.push(item.brandId || '0');
            }
            return perpareNumber += item.number;
          });

          const complete = item.status === 99;
          const disabled = complete || perpareNumber === 0;

          if (!disabled) {
            count++;
          }

          newDetails.push({ ...item, perpareNumber, brandIds, complete, disabled });
          return null;
        });


        return { ...item, detailResults: newDetails };
      });
      setData(newData);
      getCount(count);
    },
  });


  useEffect(() => {
    if (allChecked) {
      const newOutSkus = [];
      data.map(item => {
        const detailResults = item.detailResults || [];
        return detailResults.map(item => !item.disabled && newOutSkus.push(item));
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

  const checkChange = (checked, skuItem) => {
    if (!checked) {
      outSkusChange([...value, skuItem]);
    } else {
      outSkusChange(value.filter(outItem => outItem.pickListsDetailId !== skuItem.pickListsDetailId));
    }
  };


  return <>
    {data.length === 0 && <MyEmpty />}
    {
      data.map((item, index) => {
        const detailResults = item.detailResults || [];
        const checkDetails = value.filter(outItem => outItem.pickListsId === item.pickListsId);

        const actionDeatils = detailResults.filter(item => {
          return !item.disabled;
        });

        const orderChecked = actionDeatils.length !== 0 && checkDetails.length === actionDeatils.length;

        return <div key={index} className={style.orderItem}>
          <div className={style.data}>
            <div className={style.customer}>
              <MyCheck
                disabled={actionDeatils.length === 0}
                checked={orderChecked}
                fontSize={18}
                onChange={(checked) => {
                  const newOutSkus = value.filter(skuItem => skuItem.pickListsId !== item.pickListsId);
                  if (checked) {
                    outSkusChange([...newOutSkus, ...actionDeatils]);
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
            detailResults.map((detailItem, detailIndex) => {

              const complete = detailItem.complete;
              const disabled = detailItem.disabled;

              const perpareNumber = detailItem.perpareNumber || 0;
              const number = detailItem.number || 0;
              const receivedNumber = parseInt(detailItem.receivedNumber) || 0;

              const cartResults = detailItem.cartResults || [];

              let storehouse = [];
              cartResults.map(cartItem => {
                const storehouseResult = cartItem.storehouseResult || {};
                let sname = false;
                const newStorehouse = storehouse.map(item => {
                  if (storehouse.map(item => item.storehouseId).includes(item.storehouseId)) {
                    sname = true;
                    return { ...item, number: item.number + cartItem.number };
                  }
                  return item;
                });
                if (sname) {
                  storehouse = newStorehouse;
                } else {
                  storehouse.push({ ...storehouseResult, number: cartItem.number });
                }
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

              const detailChecked = checkDetails.map(item => item.pickListsDetailId).includes(detailItem.pickListsDetailId);

              const skuResut = detailItem.skuResult || {};

              if (!item.allSku && detailIndex > 2) {
                return null;
              }

              return <div key={detailIndex} className={makeStyle.sku}>
                <div hidden={!complete} className={makeStyle.mask} />
                <div hidden={!complete} className={makeStyle.logo}>
                  <img src={outStockLogo} alt='' />
                </div>
                <div className={style.skus} style={{ paddingBottom: storehouse.length > 0 && 0 }}>
                  <MyCheck
                    disabled={disabled}
                    className={style.checked}
                    checked={detailChecked}
                    fontSize={18}
                    onChange={() => {
                      checkChange(detailChecked, detailItem);
                    }}
                  />
                  <div className={style.skuItem} onClick={() => {
                    if (complete || !perpareNumber) {
                      return;
                    }
                    checkChange(detailChecked, detailItem);
                  }}>
                    <SkuItem
                      imgSize={60}
                      skuResult={skuResut}
                      extraWidth='158px'
                      otherData={[ToolUtil.isObject(detailItem.brandResult).brandName || '任意品牌']}
                    />
                  </div>
                  <div className={style.skuData} style={{ alignItems: 'center', gap: 12 }}>
                    <Slash rightText={number} leftText={receivedNumber} rightStyle={{ color: numberColor }} />
                    {perpareNumber ? <ShopNumber show value={perpareNumber} /> : ''}
                  </div>
                </div>
                <div className={style.storehouses}>
                  {
                    storehouse.map((item, index) => {
                      return <div key={index} className={style.storehouse}>
                        {`${item.name} (${item.number})`}
                      </div>;
                    })
                  }
                </div>
              </div>;
            })
          }
          {detailResults.length > 3 && <Divider className={style.allSku}>
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
            <div className={style.icon}>
              <ExclamationCircleOutline />
            </div>
            <div className={style.announcements}>
              {ToolUtil.isArray(item.announcementsResults).map(item => item.content).join('、')}
            </div>

          </div>
        </div>;
      })
    }

    {loading && <MyLoading />}
  </>;
};

export default Receipts;
