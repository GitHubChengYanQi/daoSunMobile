import React, { useState } from 'react';
import styles from '../../index.less';
import MyCheck from '../../../../components/MyCheck';
import MyList from '../../../../components/MyList';
import SkuItem from '../../../../Work/Sku/SkuItem';
import ShopNumber from '../../../../Work/AddShop/components/ShopNumber';
import { instockLogs } from '../InStockWorkDetail';

const InStockSummary = (
  {
    listRef,
    params = {},
  },
) => {

  const [list, setList] = useState([]);

  return <MyList manual ref={listRef} api={instockLogs} getData={setList} data={list}>
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
              <div className={styles.grey}>已入库</div>
              <ShopNumber show value={item.number} />
            </div>
          </div>
        </div>;
      })
    }
  </MyList>
};

export default InStockSummary;
