import React, { useEffect } from 'react';
import { ERPEnums } from '../../../../../Stock/ERPEnums';
import OutstockAsk from './components/OutstockAsk';
import MyEmpty from '../../../../../../components/MyEmpty';
import InstockAsk from './components/InstockAsk';
import CuringAsk from './components/CuringAsk';
import StocktakingAsk from './components/StocktakingAsk';
import AllocationAsk from './components/AllocationAsk';
import { ToolUtil } from '../../../../../../components/ToolUtil';

export const judgeLoginUser = { url: '/instockOrder/judgeLoginUser', method: 'GET' };
export const inventoryAdd = { url: '/inventory/add', method: 'POST' };
export const inventorySelectCondition = { url: '/inventory/selectCondition', method: 'POST' };
export const maintenanceAdd = { url: '/maintenance/add', method: 'POST' };

const InstockSkus = ({ skus = [], createType, judge, state = {} }) => {

  useEffect(()=>{
    ToolUtil.back({
      title: '未进行提交，是否退出当前页面？',
      key: 'ask',
    });
  },[])

  switch (createType) {
    case ERPEnums.outStock:
      return <OutstockAsk skus={skus} judge={judge} createType={createType} />;
    case ERPEnums.inStock:
    case ERPEnums.directInStock:
      return <InstockAsk skus={skus} judge={judge} createType={createType} />;
    case ERPEnums.curing:
      return <CuringAsk createType={createType} state={state} />;
    case ERPEnums.stocktaking:
      return <StocktakingAsk skus={skus} createType={createType} state={state} />;
    case ERPEnums.allocation:
      return <AllocationAsk skus={skus} createType={createType} />;
    default:
      return <MyEmpty />;
  }
};

export default InstockSkus;
