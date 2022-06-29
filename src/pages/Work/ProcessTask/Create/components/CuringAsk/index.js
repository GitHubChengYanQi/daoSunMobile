import React from 'react';
import Inventory from '../Inventory';
import { ERPEnums } from '../../../../Stock/ERPEnums';

const CuringAsk = (
  {
    open,
    onClose = () => {
    },
  },
) => {


  return <Inventory type={ERPEnums.curing} open={open} onClose={onClose} />;
};

export default CuringAsk;
