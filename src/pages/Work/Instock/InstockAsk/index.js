import React from 'react';
import SkuInstock from './coponents/SkuInstock';

const InStockAsk = (
  {
    title = '入库申请',
    numberTitle = '入库',
    type = 'inStock',
  }) => {

  return <div style={{height:'100%'}}>
    <SkuInstock
      title={title}
      numberTitle={numberTitle}
      type={type} />
  </div>;

};

export default InStockAsk;
