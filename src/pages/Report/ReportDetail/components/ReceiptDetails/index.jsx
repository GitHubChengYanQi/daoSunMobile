import React, { useState } from 'react';
import styles from '../../index.less';
import MyCheck from '../../../../components/MyCheck';
import SkuItem from '../../../../Work/Sku/SkuItem';
import ShopNumber from '../../../../Work/AddShop/components/ShopNumber';
import MyList from '../../../../components/MyList';
import MyProgress from '../../../../components/MyProgress';

export const instockDetailTotal = { url: '/statisticalView/instockDetailTotal', method: 'POST' };

const ReceiptDetails = (
  {
    listRef,
    params = {},
  },
) => {

  const receipt = params.searchType === 'INSTOCK_LIST';

  const [list, setList] = useState([]);

  return <>
    <MyList api={instockDetailTotal} manual ref={listRef} data={list} getData={setList}>
      {
        list.map((item, index) => {
          let number = 0;
          switch (params.searchType) {
            case 'INSTOCK_LIST':
              number = item.number;
              break;
            case 'INSTOCK_NUMBER':
              number = item.instockNumber;
              break;
            case 'NO_INSTOCK_NUMBER':
              number = item.noInstockNumber;
              break;
          }
          return <div key={index} className={styles.listItem}>
            <div key={index} className={styles.skuItem}>
              <MyCheck fontSize={17} />
              <SkuItem
                skuResult={item.skuResult}
                className={styles.sku}
                extraWidth='174px'
                otherData={[
                  item.brandResult?.brandName || '-',
                ]}
              />
              <div style={{ textAlign: 'right' }}>
                <ShopNumber show value={item.number} />
              </div>
            </div>
            <div hidden={!receipt} className={styles.progress}>
              <MyProgress percent={Math.round((item.instockNumber / item.number) * 100) || 0} />
            </div>
          </div>;
        })
      }
    </MyList>
  </>;
};

export default ReceiptDetails;
