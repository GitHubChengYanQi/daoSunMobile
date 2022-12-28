import React from 'react';
import MyEmpty from '../../../../../components/MyEmpty';
import { Space } from 'antd-mobile';
import styles from './index.less';
import Label from '../../../../../components/Label';
import SkuItem from '../../../../Sku/SkuItem';
import { isArray } from '../../../../../../util/ToolUtil';
import ShopNumber from '../../../../AddShop/components/ShopNumber';

const Skus = ({ skus, data }) => {

  if (isArray(skus).length === 0) {
    return <MyEmpty />;
  }

  return <>
    {
      skus.map((item, index) => {
        return <div key={index} className={styles.skuItem}>
          <SkuItem skuResult={item.skuResult} />
          <Space direction='vertical' style={{ width: '100%', marginTop: 8 }}>
            <div style={{ display: 'flex' }}>
              <div style={{ flexGrow: 1, display: 'flex' }}>
                <Label className={styles.label}>数量</Label>：<ShopNumber value={item.purchaseNumber} show />
              </div>
              <div style={{ flexGrow: 1 }}>
                <Label className={styles.label}>单价</Label>：{item.onePrice} {data.currency}
              </div>
            </div>
            <div style={{ display: 'flex' }} hidden={data.type !== 1}>
              <Label className={styles.label}>已到货</Label>：<ShopNumber value={item.arrivalNumber} show />
            </div>
            <div>
              <Label className={styles.label}>品牌</Label>：{item.brandResult && item.brandResult.brandName}
            </div>
            <div>
              <Label className={styles.label}>供应商</Label>：{item.customerResult && item.customerResult.customerName}
            </div>
            <div>
              <Label className={styles.label}>交货期</Label>：{item.deliveryDate || 0}天
            </div>
          </Space>

        </div>;
      })
    }
  </>;
};

export default Skus;
