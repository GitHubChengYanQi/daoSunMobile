import React from 'react';
import InStockAsk from '../../Instock/InstockAsk';
import { ERPEnums } from '../../Stock/ERPEnums';

const InventoryAsk = () => {


  return <>
    <InStockAsk title='盘点申请' type={ERPEnums.stocktaking} numberTitle='' />
  </>;
};

export default InventoryAsk;
