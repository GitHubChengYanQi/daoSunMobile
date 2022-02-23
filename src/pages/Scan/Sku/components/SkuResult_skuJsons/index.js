import React from 'react';
import { Empty } from 'antd';

const SkuResultSkuJsons = ({ skuResult }) => {

  if (!(skuResult && skuResult.spuResult))
    return null;

  return <>
    {skuResult.spuResult.spuClassificationResult && skuResult.spuResult.spuClassificationResult.name}
    &nbsp;/&nbsp;
    {skuResult.spuResult.name}
    {skuResult.specifications && <> &nbsp;/&nbsp; {skuResult.specifications}</>}
  </>;
};

export default SkuResultSkuJsons;
