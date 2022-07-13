import React from 'react';
import InStockAsk from '../../Instock/InstockAsk';
import { ERPEnums } from '../../Stock/ERPEnums';

const AllocationAsk = () => {

  return <InStockAsk numberTitle='调拨' title='调拨申请' type={ERPEnums.allocation} />
};

export default AllocationAsk;
