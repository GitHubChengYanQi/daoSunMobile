import React, { useState } from 'react';
import styles from '../../index.less';
import MyCheck from '../../../../components/MyCheck';
import SkuItem from '../../../../Work/Sku/SkuItem';
import ShopNumber from '../../../../Work/AddShop/components/ShopNumber';
import MyList from '../../../../components/MyList';
import MyProgress from '../../../../components/MyProgress';

const ReceiptDetails = (
  {
    listRef,
    params = {},
  },
) => {

  const receipt = params.receiptType === 'receipt';

  const [list, setList] = useState([1,2,3]);

  return <>
    <MyList manual ref={listRef} data={list}>
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
            <div hidden={!receipt} className={styles.progress}>
              <MyProgress percent={12} />
            </div>
          </div>;
        })
      }
    </MyList>
  </>;
};

export default ReceiptDetails;
