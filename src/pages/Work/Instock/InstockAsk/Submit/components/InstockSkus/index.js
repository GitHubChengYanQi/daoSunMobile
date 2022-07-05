import React from 'react';
import { ERPEnums } from '../../../../../Stock/ERPEnums';
import OutstockAsk from './components/OutstockAsk';
import MyEmpty from '../../../../../../components/MyEmpty';
import InstockAsk from './components/InstockAsk';
import CuringAsk from './components/CuringAsk';
import StocktakingAsk from './components/StocktakingAsk';

export const judgeLoginUser = { url: '/instockOrder/judgeLoginUser', method: 'GET' };
export const inventoryAdd = { url: '/inventory/add', method: 'POST' };
export const inventorySelectCondition = { url: '/inventory/selectCondition', method: 'POST' };
export const maintenanceAdd = { url: '/maintenance/add', method: 'POST' };

const InstockSkus = ({ skus = [], createType, judge, state = {} }) => {

  switch (createType) {
    case ERPEnums.outStock:
      return <OutstockAsk skus={skus} judge={judge} createType={createType} />;
    case ERPEnums.inStock:
    case ERPEnums.directInStock:
      return <InstockAsk skus={skus} judge={judge} createType={createType} />;
    case ERPEnums.curing:
      return <CuringAsk createType={createType} state={state}  />;
    case ERPEnums.stocktaking:
      return <StocktakingAsk skus={skus} createType={createType} state={state} />;
    default:
      return <MyEmpty />;
  }

};

export default InstockSkus;
