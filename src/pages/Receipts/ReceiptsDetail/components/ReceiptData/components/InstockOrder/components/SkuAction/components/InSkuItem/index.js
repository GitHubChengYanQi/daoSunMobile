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
    item = {},
    data = [],
    index,
    detail,
  }) => {

  const skuResult = item.skuResult || {};

  let complete;

  let error = false;

  let text = '';

  let number;

  if (detail) {
    number = item.number;
    complete = true;
    switch (item.type) {
      case 'inStock':
        text = '已入';
        break;
      case 'ErrorCanInstock':
        text = '允许入库';
        error = true;
        break;
      case 'ErrorStopInstock':
        text = '禁止入库';
        error = true;
        break;
      case 'ErrorNumber':
        text = '异常数量';
        error = true;
        break;
      default:
        break;
    }
  } else {
    complete = item.realNumber === 0 && item.status !== 0;
    number = item.askNumber;
    switch (item.status) {
      case 1:
        text = '待入';
        error = false;
        break;
      case -1:
        text = '异常';
        error = true;
        break;
      case 50:
        error = true;
        break;
      default:
        break;
    }

    if (complete) {
      text = '';
    }
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
        <span>{moment(detail ? item.createTime : item.updateTime).format('YYYY-MM-DD')}</span>
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
        <div className={error ? style.error : style.success}>
          {text}
        </div>
        <ShopNumber value={number} show />
      </div>
    </div>
  </div>;
};

export default InSkuItem;
