import React from 'react';
import style
  from '../../../../../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import { ToolUtil } from '../../../../../../../../../../components/ToolUtil';
import inStockLogo from '../../../../../../../../../../../assets/instockLogo.png';
import SkuItem from '../../../../../../../../../../Work/Sku/SkuItem';
import ShopNumber
  from '../../../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';

const InSkuItem = (
  {
    item,
    data,
  }) => {


  const skuResult = item.skuResult || {};

  const complete = item.realNumber === 0 && item.status === 99;
  const waitInStock = item.status === 1;
  const errorInStock = item.status === -1;

  return <div
    className={style.sku}
  >
    <div hidden={!(waitInStock || complete || errorInStock)} className={style.mask} />
    <div
      className={ToolUtil.classNames(
        style.skuItem,
        data.length <= 3 && style.skuBorderBottom,
      )}
    >
      <div hidden={!complete} className={style.logo}>
        <img src={inStockLogo} alt='' />
      </div>
      <div className={style.item}>
        <SkuItem
          imgSize={60}
          skuResult={skuResult}
          extraWidth='200px'
          otherData={`${ToolUtil.isObject(item.customerResult).customerName || '-'} / ${ToolUtil.isObject(item.brandResult).brandName || '-'}`}
        />
      </div>
      <div className={style.skuNumber}>
        <ShopNumber value={item.number} show />
      </div>
    </div>
    <div hidden={!waitInStock} className={style.status}>
      待入库
    </div>
    <div hidden={!errorInStock} className={style.status}>
      异常件
    </div>
  </div>;
};

export default InSkuItem;
