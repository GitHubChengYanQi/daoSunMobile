import React, { useState } from 'react';
import styles from '../../index.less';
import MyCheck from '../../../../components/MyCheck';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import SkuItem from '../../../../Work/Sku/SkuItem';
import ShopNumber from '../../../../Work/AddShop/components/ShopNumber';
import MyEllipsis from '../../../../components/MyEllipsis';

const InStockNumber = (
  {
    listRef,
    params = {},
  },
) => {

  const [list, setList] = useState([1,2,3,4]);

  const [open, setOpen] = useState();

  return list.map((item, index) => {
    let title = '物料采购';
    switch (params.type) {
      case '1':
        break;
      default:
        break;
    }
    const show = open === index;

    return <div key={index} className={styles.listItem}>
      <div className={styles.header}>
        <MyCheck fontSize={17} />
        <div className={styles.label}><MyEllipsis>{title}</MyEllipsis></div>
        <div onClick={() => {
          setOpen(show ? undefined : index);
          if (show) {
            return;
          }
        }}>{!show ? <DownOutline /> : <UpOutline />}</div>
      </div>
      <div className={styles.content} hidden={!show}>
        {
          [1, 2, 3].map((item, index) => {
            return <div key={index} className={styles.skuItem}>
              <SkuItem
                skuResult={item.skuResult}
                className={styles.sku}
                extraWidth='124px'
                otherData={[
                  <span className={styles.number}>拒绝入库 <span className={styles.error}>×2000</span></span>,
                ]}
              />
              <div style={{ textAlign: 'right' }}>
                <div className={styles.grey}>已入库</div>
                <ShopNumber show value={item.number} />
              </div>
            </div>;
          })
        }
      </div>
      <div className={styles.space} />
    </div>;
  });
};

export default InStockNumber;
