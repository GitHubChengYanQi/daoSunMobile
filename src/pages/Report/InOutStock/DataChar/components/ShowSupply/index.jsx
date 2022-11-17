import React from 'react';
import style from '../../../index.less';
import { isArray } from '../../../../../components/ToolUtil';

const ShowSupply = (
  {
    supplys = [],
    hidden,
    searchParams,
  },
) => {

  if (hidden) {
    return <></>;
  }

  return <div className={style.otherContent}>
    {supplys.map((item, index) => {
      return <div key={index} className={style.skuSupply}>
        <div className={style.skuSupplyHead}>
          <div className={style.skuSupplyLabel}>{item.customerName}</div>
          <div className={style.skuSupplyNumber}>到货</div>
          <div className={style.skuSupplyNumber}>终止入库</div>
          <div className={style.skuSupplyNumber}>已入库</div>
        </div>
        {
          isArray(searchParams.show).includes('brand') ? isArray(item.brands).map((item, index) => {
            return <div key={index} className={style.skuSupplyContent}>
              <div className={style.skuSupplyLabel}>{item.brandName || '无品牌'}</div>
              <div className={style.skuSupplyNumber}>× 0</div>
              <div className={style.skuSupplyNumber}><span className='red'>×0</span></div>
              <div className={style.skuSupplyNumber}>× 0</div>
            </div>;
          }) : <div className={style.skuSupplyContent}>
            <div className={style.skuSupplyLabel}>数量</div>
            <div className={style.skuSupplyNumber}>× 0</div>
            <div className={style.skuSupplyNumber}><span className='red'>×0</span></div>
            <div className={style.skuSupplyNumber}>× 0</div>
          </div>
        }
      </div>;
    })}
  </div>;
};

export default ShowSupply;
