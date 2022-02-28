import React from 'react';

const BackSkus = ({ record }) => {

  if (!record.spuResult) {
    return null;
  }

  return <>
    {record.spuResult.name}
    &nbsp;/&nbsp;
    {record.skuName}
    {record.specifications && <> &nbsp;/&nbsp; {record.specifications}</>}
  </>;
};

export default BackSkus;
