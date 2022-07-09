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

  const complete = item.realNumber === 0 && item.status === 99;

  let text = '';
  let error = false;

  switch (item.status) {
    case 99:
      if (item.realNumber === 0) {
        text = '已入';
      }
      break;
    case 1:
      text = '待入';
      break;
    case -1:
      text = '异常';
      error = true;
      break;
    case 50:
      text = '禁止入库';
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
        text && style.inStockSkuItem,
        data.length <= 3 && style.skuBorderBottom,
      )}
    >
      <div hidden={!text} className={ToolUtil.classNames(style.logo, error ? style.errLogo : style.infoLogo)}>
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
        <div style={{ color: error ? 'var(--adm-color-danger)' : 'var(--adm-color-primary)' }}>{text}</div>
        <ShopNumber value={complete ? item.instockNumber : item.number} show />
      </div>
    </div>
  </div>;
};

export default InSkuItem;
