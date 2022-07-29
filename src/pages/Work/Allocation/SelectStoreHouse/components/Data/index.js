import React, { useState } from 'react';
import MyCard from '../../../../../components/MyCard';
import style from '../../index.less';
import SkuItem from '../../../../Sku/SkuItem';
import LinkButton from '../../../../../components/LinkButton';
import ShopNumber from '../../../../Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import MyEmpty from '../../../../../components/MyEmpty';
import View
  from '../../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/Allocation/components/AllocationSkuItem/components/View';
import MyAntPopup from '../../../../../components/MyAntPopup';

const Data = (
  {
    out,
    storeHouses = [],
    setVisible = () => {
    },
    noLink,
    show,
  }) => {

  const [view, setView] = useState();

  if (!Array.isArray(storeHouses) || storeHouses.length === 0) {
    return <MyEmpty />;
  }

  return storeHouses.map((item, index) => {
    const skus = item.skus || [];

    let number = 0;
    skus.map(item => number += item.number);

    return <MyCard
      className={style.card}
      headerClassName={style.cardHeader}
      key={index}
      titleBom={<div className={style.storeTitle}>
        {item.name}
      </div>}
      extra={<>
        合计 <span className='numberBlue'>{skus.length}</span> 类 <span className='numberBlue'>{number}</span>件
      </>}
    >
      {
        skus.map((item, index) => {
          const brandNames = [];
          const brands = item.storeBrands || [];
          const positions = item.storePositions || [];
          brands.forEach(item => {
            if (!brandNames.includes(item.brandName)) {
              brandNames.push(item.brandName || '无品牌');
            }
          });
          positions.forEach(item => {
            const brands = item.brands || [];
            brands.forEach(item => {
              if (!brandNames.includes(item.brandName)) {
                brandNames.push(item.brandName || '无品牌');
              }
            });
          });
          return <div
            key={index}
            className={style.SkuItem}
          >
            <div className={style.sku}>
              <SkuItem
                skuResult={item.skuResult}
                otherData={[
                  brandNames.join('/'),
                  show && <LinkButton onClick={() => setView(item)}>查看详情</LinkButton>,
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
              <ShopNumber show value={item.number} />
            </div>
          </div>;
        })
      }
      <MyAntPopup title='申请详情' visible={view} onClose={() => setView(false)}>
        <View out={out} sku={view} />
      </MyAntPopup>
    </MyCard>;
  });
};

export default Data;
