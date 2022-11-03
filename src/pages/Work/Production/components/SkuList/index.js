import React from 'react';
import { Card } from 'antd-mobile';
import {SkuResultSkuJsons} from '../../../../Scan/Sku/components/SkuResult_skuJsons';
import MyEmpty from '../../../../components/MyEmpty';
import styles from '../../index.less';

const SkuList = ({ data }) => {

  if (!Array.isArray(data) || data.length === 0) {
    return <MyEmpty />;
  }

  return <div className={styles.mainDiv}>
    {
      data.map((item, index) => {
        const skuResult = item.skuResult || {};
        return <Card key={index} style={{ margin: 8 }}>
          <div>
            {SkuResultSkuJsons({skuResult})}
            <div style={{ float: 'right' }}>
              × {item.planNumber}
            </div>
          </div>
        </Card>;
      })
    }
  </div>;
};

export default SkuList;
