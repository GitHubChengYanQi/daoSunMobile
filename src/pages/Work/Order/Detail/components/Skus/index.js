import React from 'react';
import MyEmpty from '../../../../../components/MyEmpty';
import { Card, Space } from 'antd-mobile';
import MyEllipsis from '../../../../../components/MyEllipsis';
import {SkuResultSkuJsons} from '../../../../../Scan/Sku/components/SkuResult_skuJsons';
import Label from '../../../../../components/Label';

const Skus = ({ skus,data }) => {

  if (!Array.isArray(skus)) {
    return <MyEmpty />;
  }

  return <>
    {
      skus.map((item, index) => {
        return <Card
          headerStyle={{display:'block'}}
          key={index}
          title={<div>
            <MyEllipsis>
              {SkuResultSkuJsons({skuResult:item.skuResult})} </MyEllipsis>
          </div>}
          style={{ margin: 8 }}>
          <Space direction='vertical'>
            <div style={{display:'flex'}}>
              <div style={{flexGrow:1}}>
                <Label>数量：</Label>{item.purchaseNumber}
              </div>
              <div style={{flexGrow:1}}>
                <Label>单价：</Label>{item.onePrice} / {data.currency}
              </div>
            </div>
            <div>
              <Label>品牌：</Label>{item.brandResult && item.brandResult.brandName}
            </div>
            <div>
              <Label>供应商：</Label>{item.customerResult && item.customerResult.customerName}
            </div>
            <div>
              <Label>交货期：</Label>{item.deliveryDate}天
            </div>
          </Space>

        </Card>;
      })
    }
  </>;
};

export default Skus;
