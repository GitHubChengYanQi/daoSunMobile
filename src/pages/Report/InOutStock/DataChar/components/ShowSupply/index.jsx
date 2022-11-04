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
          <div className={style.skuSupplyLabel}>辽宁辽工智能装备制造...</div>
          <div className={style.skuSupplyNumber}>到货</div>
          <div className={style.skuSupplyNumber}>终止入库</div>
          <div className={style.skuSupplyNumber}>已入库</div>
        </div>
        {
          isArray(searchParams.show).includes('brand') ? [1, 2].map((item, index) => {
            return <div key={index} className={style.skuSupplyContent}>
              <div className={style.skuSupplyLabel}>辽工智能</div>
              <div className={style.skuSupplyNumber}>× 20000</div>
              <div className={style.skuSupplyNumber}>× 20000</div>
              <div className={style.skuSupplyNumber}>× 20000</div>
            </div>;
          }) : <div className={style.skuSupplyContent}>
            <div className={style.skuSupplyLabel}>数量</div>
            <div className={style.skuSupplyNumber}>× 20000</div>
            <div className={style.skuSupplyNumber}>× 20000</div>
            <div className={style.skuSupplyNumber}>× 20000</div>
          </div>
        }
      </div>;
    })}
  </div>;
};

export default ShowSupply;
