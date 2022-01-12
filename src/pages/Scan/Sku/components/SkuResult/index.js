import React from 'react';
import {Empty} from 'antd';

const SkuResult = ({skuResult}) => {

  if (!(skuResult && skuResult.spuResult))
    return <Empty />;


  return <>
    {skuResult.spuResult.spuClassificationResult.name}
    &nbsp;/&nbsp;
    {skuResult.spuResult.name}
    &nbsp;&nbsp;
    {
      skuResult.list
      &&
      skuResult.list.length > 0
      &&
      skuResult.list[0].attributeValues
      &&
      <em style={{color: '#c9c8c8', fontSize: 10}}>
        (
        {
          skuResult.list.map((items, index) => {
            return <span key={index}>{items.itemAttributeResult.attribute}：{items.attributeValues}</span>;
          })
        }
        )
      </em>}
  </>;
};

export default SkuResult;
