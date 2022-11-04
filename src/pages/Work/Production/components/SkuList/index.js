import React from 'react';
import { Card } from 'antd-mobile';
import { SkuResultSkuJsons } from '../../../../Scan/Sku/components/SkuResult_skuJsons';
import MyEmpty from '../../../../components/MyEmpty';
import styles from '../../index.less';
import SkuItem from '../../../Sku/SkuItem';
import ShopNumber from '../../../AddShop/components/ShopNumber';

const SkuList = ({ data }) => {

  if (!Array.isArray(data) || data.length === 0) {
    return <MyEmpty />;
  }

  return <div className={styles.mainDiv}>
    {
      data.map((item, index) => {
        const skuResult = item.skuResult || {};
        return <div key={index} className={styles.skuItem}>
          <SkuItem extraWidth='80px' className={styles.sku} skuResult={skuResult} />
          <ShopNumber show value={item.planNumber} />
        </div>;
      })
    }
  </div>;
};

export default SkuList;
