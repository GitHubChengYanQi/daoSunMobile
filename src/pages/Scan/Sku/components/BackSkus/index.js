import React from 'react';
import {Empty} from 'antd';

const BackSkus = ({record}) => {

  if (!record.spuResult) {
    return <Empty />;
  }

  return <>
    {record.spuResult.spuClassificationResult && record.spuResult.spuClassificationResult.name}
    &nbsp;/&nbsp;
    {record.spuResult.name}
    &nbsp;&nbsp;
    <em style={{color: '#c9c8c8', fontSize: 10}}>
      (
      {
        record.backSkus
        &&
        record.backSkus.map((items, index) => {
          return (
            <span key={index}>{items.itemAttribute.attribute}：{items.attributeValues.attributeValues}</span>
          );
        })
      }
      )
    </em>
  </>;
};

export default BackSkus;
