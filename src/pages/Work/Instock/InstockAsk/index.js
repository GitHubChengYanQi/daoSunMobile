import React from 'react';
import SkuInstock from './coponents/SkuInstock';

const InStockAsk = (
  {
    title = '入库申请',
    numberTitle = '入库',
    type = 'inStock',
    judge,
  }) => {

  return <div style={{height:'100%'}}>
    <SkuInstock
      judge={judge}
      title={title}
      numberTitle={numberTitle}
      type={type} />
  </div>;

};

export default InStockAsk;
