import React from 'react';
import SkuItem from '../../../../../../../../../../Work/Sku/SkuItem';
import ShopNumber
  from '../../../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import style from './index.less';
import { Divider } from 'antd-mobile';

const View = ({ out, sku = {} }) => {

  const brands = sku.brands || [];
  const storeHouse = sku.storeHouse || [];

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
    <div className={style.content}>
      <Divider contentPosition='left'>{sku.haveBrand ? '指定品牌' : '任意品牌'}</Divider>
      {
        brands.map((item, index) => {
          const positions = item.positions || [];
          return <div key={index} className={style.brandItem}>
            <div className={style.brandName}>
              {sku.haveBrand ? (item.brandName || '无品牌') : '任意品牌'}
              <div className={style.number}>× {item.number}</div>
            </div>
            {
              positions.map((item, index) => {
                return <div key={index} className={style.positionName}>
                  {item.name}
                  <div className={style.number}>× {item.number}</div>
                </div>;
              })
            }
          </div>;
        })
      }
      <Divider contentPosition='left'>{out ? '指定调入' : '指定调出'}</Divider>
      {
        storeHouse.map((item, index) => {
          const positions = item.positions || [];
          const brands = item.brands || [];
          return <div key={index} className={style.brandItem}>
            <div className={style.brandName}>
              {item.name}
              <div className={style.number}>× {item.number}</div>
            </div>
            {
              positions.length > 0 ?
                positions.map((item, index) => {
                  const brands = item.brands || [];
                  return <div key={index} className={style.brandItem} style={{ margin: 12 }}>
                    <div className={style.brandName}>
                      {item.name}
                      <div className={style.number}>× {item.number}</div>
                    </div>
                    {
                      brands.map((item, index) => {
                        return <div hidden={!item.checked} key={index} className={style.positionName}>
                          {item.brandName || '无品牌'}
                          <div className={style.number}>× {item.number}</div>
                        </div>;
                      })
                    }
                  </div>;
                })
                :
                brands.map((item, index) => {
                  return <div hidden={!item.checked} key={index} className={style.positionName}>
                    {item.brandName || '无品牌'}
                    <div className={style.number}>× {item.number}</div>
                  </div>;
                })
            }
          </div>;
        })
      }
    </div>

  </div>;
};

export default View;
