import React from 'react';
import style from '../../index.less';
import SkuItem from '../../../../../../../../Work/Sku/SkuItem';
import ShopNumber from '../../../../../../../../Work/AddShop/components/ShopNumber';
import { Button } from 'antd-mobile';

const ErrorItem = (
  {
    onClick = () => {
    },
    item,
    totalTitle,
    index,
    otherData,
    show,
  },
) => {

  return <div key={index}>
    <div className={style.skuItem}>
      <div className={style.sku}>
        <SkuItem
          extraWidth='100px'
          skuResult={item.skuResult}
          number={item.needNumber}
          otherData={otherData}
        />
      </div>
      <div className={style.realNumber}>
        <ShopNumber show value={item.realNumber} />
        <div className={style.status}>
          · {item.status === 99 ? '已处理' : '处理中'}
        </div>
        <Button className={style.action} onClick={onClick}>{show ? '查看' : '处理'}</Button>
      </div>
    </div>

    <div className={style.error}>
      <div><span>{totalTitle}：<span>{item.needNumber}</span></span>
      </div>
      <div hidden={!item.errorNumber}>数量差异：<span
        className={style.red}>{item.errorNumber > 0 ? `+${item.errorNumber}` : item.errorNumber}</span>
      </div>
      <div hidden={!item.otherNumber}>其他异常：<span className={style.yellow}>{item.otherNumber}</span></div>
    </div>
  </div>;
};

export default ErrorItem;
