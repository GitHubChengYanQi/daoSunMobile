import React from 'react';
import SkuItem from '../../../../../../../../../../Work/Sku/SkuItem';
import ShopNumber
  from '../../../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import style from './index.less';
import { Divider } from 'antd-mobile';

const View = ({ sku = {} }) => {

  const brands = sku.brands || [];

  return <div className={style.view}>
    <div className={style.skuItem}>
      <SkuItem
        extraWidth='124px'
        className={style.sku}
        skuResult={sku.skuResult}
        otherData={[
          sku.haveBrand ? brands.map(item => item.brandName).join(' / ') : '任意品牌',
        ]} />
      <ShopNumber show value={sku.number} />
    </div>
    <div>
      <Divider contentPosition='left'>{sku.haveBrand ? '指定品牌' : '任意品牌'}</Divider>
      {
        [].map((item, index) => {
          return <div key={index} className={style.brandItem}>
            <div>
              <div>{item.brandName}</div>
              <div><ShopNumber show value={item.number} /></div>
            </div>
          </div>;
        })
      }
    </div>

  </div>;
};

export default View;
