import React, { useState } from 'react';
import styles from '../../index.less';
import MyCheck from '../../../../components/MyCheck';
import SkuItem from '../../../../Work/Sku/SkuItem';
import ShopNumber from '../../../../Work/AddShop/components/ShopNumber';
import MyList from '../../../../components/MyList';

export const outBySku = { url: '/statisticalView/outBySku', method: 'POST' };

const OutStockSummary = (
  {
    listRef,
    params = {},
  },
) => {

  const [list, setList] = useState([]);

  return <MyList manual ref={listRef} api={outBySku} getData={setList} data={list}>
    {
      list.map((item, index) => {

        return <div key={index} className={styles.listItem}>
          <div key={index} className={styles.skuItem}>
            <MyCheck fontSize={17} />
            <SkuItem
              skuResult={item.skuResult}
              className={styles.sku}
              extraWidth='174px'
            />
            <div style={{ textAlign: 'right' }}>
              <ShopNumber show value={item.number} />
            </div>
          </div>
        </div>;
      })
    }
  </MyList>
};

export default OutStockSummary;
