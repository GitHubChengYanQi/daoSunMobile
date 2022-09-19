import React from 'react';
import style
  from '../../../../../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import { ToolUtil } from '../../../../../../../../../../components/ToolUtil';
import SkuItem from '../../../../../../../../../../Work/Sku/SkuItem';
import ShopNumber
  from '../../../../../../../../../../Work/AddShop/components/ShopNumber';
import moment from 'moment';
import MyProgress from '../../../../../../../../../../components/MyProgress';

const InSkuItem = (
  {
    item = {},
    dataLength,
    index,
    detail,
    ask,
    other,
  }) => {

  const skuResult = item.skuResult || {};

  let complete;
  let error = false;
  let text = '';
  let number = item.number;

  if (detail) {
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
        text = '终止入库';
        error = true;
        break;
      case 'ErrorNumber':
        text = '异常数量';
        error = true;
        break;
      default:
        break;
    }
  } else if (ask || other) {
    complete = item.realNumber === 0 && item.status !== 0;
    number = other ? item.number : item.realNumber;
    switch (item.status) {
      case 1:
        text = '待入';
        error = false;
        break;
      case -1:
        text = item.anomalyHandle === 'canInStock' ? '异常待入' : '异常';
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

  return <>
    <div
      className={ToolUtil.classNames(style.sku)}
      style={{ margin: 0 }}
    >
      <div
        className={ToolUtil.classNames(
          style.skuItem,
          style.inStockSkuItem,
        )}
      >
        <div hidden={!complete} className={ToolUtil.classNames(style.logo, error ? style.errLogo : style.infoLogo)}>
          <span>{moment(detail ? item.createTime : item.updateTime).format('YYYY-MM-DD')}</span>
        </div>
        <div className={style.item}>
          <SkuItem
            imgId={`skuImg${index}`}
            skuResult={skuResult}
            extraWidth='110px'
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
          <ShopNumber shopClassName={style.shopNumber} value={number} show />
        </div>
      </div>
      {
        !detail && !ask && !other && <div style={{marginBottom:12}}>
          <MyProgress
            percent={parseInt((item.instockNumber / item.number) * 100)}
          />
        </div>
      }
    </div>
    <div hidden={index === dataLength} className={style.space} />
  </>;
};

export default InSkuItem;
