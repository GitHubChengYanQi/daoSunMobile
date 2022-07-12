import React from 'react';
import style
  from '../../../../../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import { ToolUtil } from '../../../../../../../../../../components/ToolUtil';
import SkuItem from '../../../../../../../../../../Work/Sku/SkuItem';
import ShopNumber
  from '../../../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import moment from 'moment';

const InSkuItem = (
  {
    item,
    data,
    index,
  }) => {

  const skuResult = item.skuResult || {};

  const complete = item.status !== 0;

  let error = false;

  switch (item.status) {
    case -1:
      error = true;
      break;
    case 50:
      error = true;
      break;
    default:
      break;
  }


  return <div
    className={style.sku}
  >
    <div
      className={ToolUtil.classNames(
        style.skuItem,
        complete && style.inStockSkuItem,
        data.length <= 3 && style.skuBorderBottom,
      )}
    >
      <div hidden={!complete} className={ToolUtil.classNames(style.logo, error ? style.errLogo : style.infoLogo)}>
        <span>{moment(item.updateTime).format('YYYY-MM-DD')}</span>
      </div>
      <div className={style.item}>
        <SkuItem
          imgId={`skuImg${index}`}
          skuResult={skuResult}
          extraWidth='150px'
          otherData={[
            ToolUtil.isObject(item.customerResult).customerName,
            ToolUtil.isObject(item.brandResult).brandName || '无品牌',
          ]}
        />
      </div>
      <div className={style.skuNumber}>
        <ShopNumber value={item.number} show />
      </div>
    </div>
  </div>;
};

export default InSkuItem;
