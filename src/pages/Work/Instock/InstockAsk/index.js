import React from 'react';
import SkuInstock from './coponents/SkuInstock';

const InStockAsk = (
  {
    title = '入库申请',
    type = 'inStock',
    judge,
  }) => {

  return <div style={{ height: '100%' }}>
    <SkuInstock
      judge={judge}
      title={title}
      type={type}
    />
  </div>;

};

export default InStockAsk;
