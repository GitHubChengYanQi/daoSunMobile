import React from 'react';
import AddShop from '../../AddShop';
import { ERPEnums } from '../../Stock/ERPEnums';

const Ask = () => {


  return <AddShop title='调拨申请' type={ERPEnums.allocation} />;
};

export default Ask;
