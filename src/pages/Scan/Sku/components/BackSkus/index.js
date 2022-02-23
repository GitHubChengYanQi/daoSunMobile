import React from 'react';

const BackSkus = ({ record }) => {

  if (!record.spuResult) {
    return null;
  }

  return <>
    {record.spuResult.spuClassificationResult && record.spuResult.spuClassificationResult.name}
    &nbsp;/&nbsp;
    {record.spuResult.name}
    {record.specifications && <> &nbsp;/&nbsp; {record.specifications}</>}
  </>;
};

export default BackSkus;
