import React from 'react';
import style from '../../../../../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import { ToolUtil } from '../../../../../../../../../../components/ToolUtil';
import outStockLogo from '../../../../../../../../../../../assets/outStockLogo.png';
import Slash from '../../../../../../../../../../Work/MyPicking/components/Slash';
import SkuItem from '../../../../../../../../../../Work/Sku/SkuItem';

const OutSkuItem = ({item,data}) => {
  const skuResult = item.skuResult || {};

  const complete = item.complete;
  const prepare = item.prepare;

  let stockNumberColor = '';
  let stockNumberText = '';

  switch (item.stockNumber || 0) {
    case 0:
      stockNumberColor = '#EA0000';
      stockNumberText = '零库存';
      break;
    default:
      if (item.isMeet) {
        stockNumberColor = '#2EAF5D';
        stockNumberText = '库存充足';
      } else {
        stockNumberColor = '#257BDE';
        stockNumberText = '部分满足';
      }
      break;
  }

  return <div
    className={style.sku}
  >
    <div hidden={!(complete || prepare)} className={style.mask} />
    <div
      className={ToolUtil.classNames(
        style.skuItem,
        data.length <= 3 && style.skuBorderBottom,
      )}
    >
      <div hidden={!complete} className={style.logo}>
        <img src={outStockLogo} alt='' />
      </div>
      <div className={style.item}>
        <SkuItem
          number={skuResult.stockNumber}
          imgSize={60}
          skuResult={skuResult}
          extraWidth='124px'
          otherData={[ToolUtil.isObject(item.brandResult).brandName]}
        />
      </div>
      <div className={style.outStockNumber} style={{
        paddingRight: prepare && 20,
      }}>
        <Slash leftText={item.receivedNumber || 0} rightText={item.number} rightStyle={{color:stockNumberColor}} />
        <div>已备料：{item.perpareNumber}</div>
      </div>
    </div>
    <div hidden={!prepare} className={style.status}>
      已备料
    </div>
  </div>;
};

export default OutSkuItem;
