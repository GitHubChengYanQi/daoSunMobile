import React from 'react';
import style from '../../index.less';
import SkuItem from '../../../../../../../../Work/Sku/SkuItem';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import ShopNumber from '../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';

const ErrorItem = (
  {
    onClick = () => {
    },
    item,
    totalTitle,
    index,
  },
) => {


  return <div key={index}>
    <div className={style.skuItem} onClick={onClick}>
      <div className={style.sku}>
        <SkuItem
          extraWidth='100px'
          skuResult={item.skuResult}
          otherData={[
            ToolUtil.isObject(item.customer).customerName,
            ToolUtil.isObject(item.brand).brandName || '无品牌',
          ]}
        />
      </div>
      <div className={style.realNumber}>
        <ShopNumber show value={item.realNumber} />
        <div className={style.status}>
          · {item.status === 99 ? '已处理' : '处理中'}
        </div>
      </div>
    </div>

    <div className={style.error}>
      <div><span>{totalTitle}：<span>{item.needNumber}</span></span>
      </div>
      <div hidden={!item.errorNumber}>数量 <span
        className={style.red}>{item.errorNumber > 0 ? `+${item.errorNumber}` : item.errorNumber}</span>
      </div>
      <div hidden={!item.otherNumber}>质量 <span className={style.yellow}>{item.otherNumber}</span></div>
    </div>
  </div>;
};

export default ErrorItem;