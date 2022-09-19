import React from 'react';
import MyCard from '../../../../../components/MyCard';
import style from '../../index.less';
import SkuItem from '../../../../Sku/SkuItem';
import LinkButton from '../../../../../components/LinkButton';
import ShopNumber from '../../../../AddShop/components/ShopNumber';
import MyEmpty from '../../../../../components/MyEmpty';
import { ToolUtil } from '../../../../../components/ToolUtil';
import moment from 'moment';

const Data = (
  {
    show,
    storeHouses = [],
    setVisible = () => {
    },
    noLink,
    noStoreHouse,
  }) => {

  if (!Array.isArray(storeHouses) || storeHouses.length === 0) {
    return <MyEmpty />;
  }

  return storeHouses.map((item, index) => {
    const skus = item.skus || [];

    let number = 0;
    skus.map(item => number += item.storeNumber);

    return <MyCard
      style={{ padding: noStoreHouse && 0 }}
      className={style.card}
      headerClassName={style.cardHeader}
      key={index}
      titleBom={<div hidden={noStoreHouse} className={style.storeTitle}>
        {item.name}
      </div>}
      extra={<div hidden={noStoreHouse}>
        合计 <span className='numberBlue'>{skus.length}</span> 类 <span className='numberBlue'>{number}</span>件
      </div>}
    >
      {
        skus.map((item, index) => {
          const brandNames = [];
          const brands = item.storeBrands || [];
          const positions = item.storePositions || [];

          let complete = false;

          brands.forEach(item => {
            if (item.instockOrderId) {
              complete = true;
            }
            if (!brandNames.includes(item.brandName)) {
              brandNames.push(item.brandName || '无品牌');
            }
          });
          positions.forEach(item => {
            const brands = item.brands || [];
            brands.forEach(item => {
              if (item.instockOrderId) {
                complete = true;
              }
              if (!brandNames.includes(item.brandName)) {
                brandNames.push(item.brandName || '无品牌');
              }
            });
          });

          return <div
            key={index}
            style={{ border: index === skus.length - 1 && 'none', alignItems: show && complete && 'flex-start' }}
            className={style.SkuItem}
          >
            <div hidden={!(show && complete)} className={style.logo}>
              <span>{moment(item.updateTime).format('YYYY-MM-DD')}</span>
            </div>
            <div className={style.sku}>
              <SkuItem
                skuResult={item.skuResult}
                otherData={[
                  brandNames.join('/'),
                ]}
                extraWidth='140px'
              />
            </div>
            <div className={style.newAction}>
              {!noLink && <LinkButton
                color='danger'
                onClick={() => {
                  setVisible({ ...item, edit: true });
                }}
              >重新分配</LinkButton>}
              <ShopNumber show value={item.storeNumber} />
            </div>
          </div>;
        })
      }
    </MyCard>;
  });
};

export default Data;
