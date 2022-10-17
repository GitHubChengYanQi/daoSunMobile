import React, { useEffect, useState } from 'react';
import { ERPEnums } from '../Stock/ERPEnums';
import OutstockAsk from './components/OutstockAsk';
import MyEmpty from '../../components/MyEmpty';
import InstockAsk from './components/InstockAsk';
import CuringAsk from './components/CuringAsk';
import StocktakingAsk from './components/StocktakingAsk';
import AllocationAsk from './components/AllocationAsk';
import { ToolUtil } from '../../components/ToolUtil';
import { history, useLocation } from 'umi';

export const judgeLoginUser = { url: '/instockOrder/judgeLoginUser', method: 'GET' };
export const inventoryAdd = { url: '/inventory/add', method: 'POST' };
export const maintenanceAdd = { url: '/maintenance/add', method: 'POST' };

const CreateTask = (
  {
    createType,
  }) => {

  const { query, state = {} } = useLocation();

  const skus = ToolUtil.isArray(state.skus);
  const judge = state.judge;

  if (query.createType) {
    createType = query.createType;
  }

  const [backTitle, setBackTitle] = useState();

  useEffect(() => {
    const winHistory = window.history || {};
    const historyState = winHistory.state || {};
    let title = '';
    switch (createType || type) {
      case ERPEnums.outStock:
        title = '出库';
        break;
      case ERPEnums.inStock:
      case ERPEnums.directInStock:
        title = '入库';
        break;
      case ERPEnums.curing:
        title = '养护';
        break;
      case ERPEnums.stocktaking:
        title = '盘点';
        break;
      case ERPEnums.allocation:
        title = '调拨';
        break;
      default:
        break;
    }

    const backTitle = `${title}申请未提交，是否退出？`;
    setBackTitle(backTitle);
    ToolUtil.back({
      getContainer: document.getElementById('createTask'),
      title: backTitle,
      key: 'ask',
      disabled: ['spus', 'ask'].includes(historyState.title || historyState.key),
    });

    if (historyState.title === 'spus') {
      history.go(-1);
    }
  }, []);

  const content = () => {
    switch (createType || type) {
      case ERPEnums.outStock:
        return <OutstockAsk skus={skus} judge={judge} createType={createType} defaultParams={state} />;
      case ERPEnums.inStock:
      case ERPEnums.directInStock:
        return <InstockAsk skus={skus} judge={judge} createType={createType} defaultParams={state} />;
      case ERPEnums.curing:
        return <CuringAsk createType={createType} backTitle={backTitle} defaultParams={state} />;
      case ERPEnums.stocktaking:
        return <StocktakingAsk backTitle={backTitle} createType={createType} defaultParams={state} />;
      case ERPEnums.allocation:
        return <AllocationAsk createType={createType} defaultParams={state} />;
      default:
        return <MyEmpty />;
    }
  };

  return <div id='createTask'>
    {content()}
  </div>;

};

export default CreateTask;
