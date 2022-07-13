import React from 'react';
import InStockAsk from '../../Instock/InstockAsk';
import { ERPEnums } from '../../Stock/ERPEnums';

const OutStockAsk = () => {

  return <InStockAsk numberTitle='出库' title='出库申请' type={ERPEnums.outStock} />
};

export default OutStockAsk;
