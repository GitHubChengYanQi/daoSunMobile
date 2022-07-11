import React from 'react';
import style from '../../index.less';
import MyCheck from '../../../../../components/MyCheck';
import SkuItem from '../../../../Sku/SkuItem';
import ShopNumber from '../../../../Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import { ToolUtil } from '../../../../../components/ToolUtil';
import { Progress } from 'antd';
import { collectableColor, notPreparedColor, receivedColor } from '../../index';

const OutSkuItem = (
  {
    skuItem,
    checkSkuKey = [],
    skuIndex,
    skuChange = () => {
    },
    checkSku = [],
    detailChange = () => {
    },
    storeHouseIndex,
  }) => {

  const cartResults = skuItem.cartResults || [];

  let receivedNumber = 0;
  let perpareNumber = 0;

  const detailKeys = [];

  cartResults.map(item => {
    detailKeys.push(item.key);
    const detail = item.productionPickListsDetailResult || {};
    receivedNumber += parseInt(detail.receivedNumber || 0);
    perpareNumber += (item.number || 0);
    return null;
  });

  const skuChecked = checkSkuKey.filter(item => detailKeys.includes(item)).length === detailKeys.length;

  return <div key={skuIndex} className={style.skus}>
    <div className={style.skuItem} onClick={() => {
      const newCheckSku = checkSku.filter(item => !detailKeys.includes(item.key));
      if (skuChecked) {
        skuChange(newCheckSku);
      } else {
        skuChange([...newCheckSku, ...cartResults]);
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
        <ShopNumber show value={perpareNumber} />
      </div>
    </div>

    {
      cartResults.map((detailItem, detailIndex) => {
        const detail = detailItem.productionPickListsDetailResult || {};
        const pickListsResult = detail.pickListsResult || {};

        const received = detail.receivedNumber || 0;
        const collectable = detailItem.number || 0;
        const notPrepared = detail.number - collectable - receivedNumber;

        const successPercent = Number(((received / detail.number)).toFixed(2)) * 100;
        const percent = Number(((collectable / detail.number)).toFixed(2)) * 100;
        const trail = Number(((notPrepared / detail.number)).toFixed(2)) * 100;

        const orderChecked = checkSkuKey.includes(detailItem.key);

        return <div key={detailIndex} className={style.askData}>
          <div className={style.order} onClick={() => {
            if (orderChecked) {
              skuChange(checkSku.filter(item => item.key !== detailItem.key));
            } else {
              skuChange([...checkSku, detailItem]);
            }
          }}>
            <div className={style.outOrderData}>
              <MyCheck checked={orderChecked} />
              <div className={style.title}>
                <div className={style.outOrder}>
                  {ToolUtil.isObject(pickListsResult.createUserResult).name}的出库申请
                  /
                  {pickListsResult.coding}
                </div>
              </div>
            </div>
            <div className={style.dataNumber}>
              <div className={style.number}>
                <div hidden={successPercent <= 0} style={{ width: `${successPercent}%` }}>{received}</div>
                <div hidden={percent <= 0} style={{ width: `${percent}%` }}>{collectable}</div>
                <div hidden={trail <= 0} style={{ width: `${trail}%` }}>{notPrepared}</div>
              </div>
              <Progress
                className={style.progress}
                format={() => {
                  return detail.number + '  (申请数)';
                }}
                percent={percent}
                success={{ percent: successPercent, strokeColor: receivedColor }}
                trailColor={notPreparedColor}
                strokeColor={collectableColor}
              />
            </div>

          </div>
          <div>
            <ShopNumber
              value={detailItem.outNumber}
              onChange={(outNumber) => {
                detailChange(storeHouseIndex, skuIndex, detailIndex, { outNumber });
              }}
            />
          </div>
        </div>;
      })
    }

  </div>;
};

export default OutSkuItem;
