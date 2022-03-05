import React from 'react';

const BackSkus = ({ record }) => {

  if (!record.spuResult) {
    return null;
  }

  return <>
    {record.spuResult.name}
    &nbsp;/&nbsp;
    {record.skuName || record.sku.skuName}
    {record.specifications && <> &nbsp;/&nbsp; {record.specifications}</>}
    {record.sku.specifications && <> &nbsp;/&nbsp; {record.sku.specifications}</>}
  </>;
};

export default BackSkus;
