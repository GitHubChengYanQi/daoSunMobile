import React from 'react';
import {Empty} from 'antd';

const SkuResultSkuJsons = ({skuResult}) => {

  if (!(skuResult && skuResult.spuResult))
    return <Empty />;

  return <>
    {skuResult.spuResult.spuClassificationResult && skuResult.spuResult.spuClassificationResult.name}
    &nbsp;/&nbsp;
    {skuResult.spuResult.name}
    &nbsp;&nbsp;
    {
      skuResult.skuJsons
      &&
      skuResult.skuJsons.length > 0
      &&
      skuResult.skuJsons[0].values.attributeValues
      &&
      <em style={{color: '#c9c8c8', fontSize: 10}}>
        (
        {
          skuResult.skuJsons.map((items, index) => {
            return (
              <span key={index}>{items.attribute.attribute}：{items.values.attributeValues}</span>
            );
          })
        }
        )
      </em>
    }
  </>;
};

export default SkuResultSkuJsons;
