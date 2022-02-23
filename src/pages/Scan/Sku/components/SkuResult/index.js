import React from 'react';
import {Empty} from 'antd';

const SkuResult = ({skuResult}) => {

  if (!(skuResult && skuResult.spuResult))
    return null;


  return <>
    {skuResult.spuResult.spuClassificationResult.name}
    &nbsp;/&nbsp;
    {skuResult.spuResult.name}
    {skuResult.specifications && <> &nbsp;/&nbsp; {skuResult.specifications}</>}
  </>;
};

export default SkuResult;
