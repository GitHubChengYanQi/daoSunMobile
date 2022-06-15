import React from 'react';
import SkuItem from '../../../Sku/SkuItem';
import MyCheck from '../../../../components/MyCheck';
import style from './index.less';
import ShopNumber from '../../../Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';

const Sku = () => {


  return <>

    {
      [1, 2, 3, 4, 5].map((item, index) => {
        return <div key={index} className={style.outSku}>
          <div className={style.skuItem}>
            <span><MyCheck /></span>
            <SkuItem />
          </div>

          {
            [1, 2, 3].map((item, index) => {
              const date = new Date();
              return <div key={index} className={style.askData}>
                <div className={style.title}>
                  <div className={style.outOrder}>xxx的出库申请 / qweqweqweeeeeeee</div>
                  <div className={style.time}>{date.getMonth() + 1} / {date.getDate()}</div>
                </div>
                <div>
                  <ShopNumber value={12} />
                </div>
              </div>;
            })
          }
        </div>;
      })
    }

  </>;
};

export default Sku;
