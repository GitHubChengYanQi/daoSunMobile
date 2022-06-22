import React from 'react';
import { ToolUtil } from '../../../../../components/ToolUtil';
import SkuClass from './components/SkuClass';
import Supply from './components/Supply';
import Brand from './components/Brand';
import State from './components/State';
import Position from './components/Position';
import Bom from './components/Bom';
import Screen from '../../../../../components/Screen';
import Time from './components/Time';
import User from './components/User';
import StockNumber from './components/StockNumber';

const SkuScreen = (
  {
    screen,
    overLengths,
    refresh,
    stockNumber,
    params,
    search,
    onClose,
    onChange,
    onClear,
    open = {},
  },
) => {

  const searchtype = [
    { key: 'skuClass', title: '分类', open: true },
    { key: 'supply', title: '供应商', open: true },
    { key: 'brand', title: '品牌', open: true },
    { key: 'state', title: '状态', open: open.state },
    { key: 'position', title: '库位', open: open.position },
    { key: 'bom', title: '物料清单', open: open.bom },
    { key: 'time', title: '创建时间', open: open.time },
    { key: 'user', title: '创建人', open: open.user },
    { key: 'number', title: '库存数', open: open.number },
  ];

  const spuClassIds = ToolUtil.isArray(params.spuClassIds);
  const customerIds = ToolUtil.isArray(params.customerIds);
  const brandIds = ToolUtil.isArray(params.brandIds);
  const statusIds = ToolUtil.isArray(params.statusIds);
  const partsSkuId = params.partsSkuId;
  const storehousePositionsId = params.storehousePositionsId;
  const time = params.startTime || params.endTime;
  const createUser = params.createUser;
  const number = params.number;

  const paramsOnChange = (data) => {
    onChange(data);
  };

  const getOptions = (key) => {
    switch (key) {
      case 'skuClass':
        return search.skuClass || [];
      case 'supply':
        return search.supplys || [];
      case 'brand':
        return search.brands || [];
      case 'state':
        return search.states || [];
      case 'position':
        return search.position || [];
      case 'bom':
        return search.boms || [];
      default:
        return [];
    }
  };

  const searchtypeScreened = (key) => {
    let screened = false;
    let overLength = false;
    switch (key) {
      case 'skuClass':
        screened = spuClassIds.length > 0;
        break;
      case 'supply':
        screened = customerIds.length > 0;
        overLength = overLengths.supply;
        break;
      case 'brand':
        screened = brandIds.length > 0;
        overLength = overLengths.brand;
        break;
      case 'state':
        screened = statusIds.length > 0;
        break;
      case 'bom':
        screened = partsSkuId;
        break;
      case 'position':
        screened = storehousePositionsId;
        break;
      case 'time':
        screened = time;
        break;
      case 'user':
        screened = createUser;
        break;
      case 'number':
        screened = number;
        break;
      default:
        break;
    }
    return { screened, overLength };
  };

  const SideBarDisabled = (key, screened, overLength) => {
    switch (key) {
      case 'skuClass':
      case 'supply':
      case 'brand':
      case 'state':
      case 'position':
        return getOptions(key).length <= 1 && !screened && !overLength;
      case 'bom':
      case 'time':
      case 'user':
        return false;
      default:
        return false;
    }
  };

  const screenContent = (item) => {
    switch (item.key) {
      case 'skuClass':
        return <SkuClass
          refresh={refresh}
          options={getOptions(item.key).map(item => {
            return { label: item.title, value: item.key };
          })}
          title={item.title}
          value={params.spuClassIds}
          onChange={(spuClassIds) => {
            paramsOnChange({ ...params, spuClassIds });
          }}
        />;
      case 'supply':
        const supply = getOptions(item.key).map(item => {
          return { label: item.title, value: item.key };
        });
        return <Supply
          overLength={overLengths.supply && supply.length === 0}
          refresh={refresh}
          title={item.title}
          options={supply}
          value={params.customerIds}
          onChange={(customerIds) => {
            paramsOnChange({ ...params, customerIds });
          }}
        />;
      case 'brand':
        const brand = getOptions(item.key).map(item => {
          return { label: item.title, value: item.key };
        });
        return <Brand
          refresh={refresh}
          options={brand}
          title={item.title}
          value={params.brandIds}
          overLength={overLengths.brand && brand.length === 0}
          onChange={(brandIds) => {
            paramsOnChange({ ...params, brandIds });
          }}
        />;
      case 'state':
        return <State
          options={getOptions(item.key).map(item => {
            return { label: item.title, value: item.key };
          })}
          title={item.title}
          value={params.statusIds}
          onChange={(statusIds) => {
            paramsOnChange({ ...params, statusIds });
          }}
        />;
      case 'position':
        return <Position
          options={getOptions(item.key)}
          title={item.title}
          refresh={refresh}
          onChange={(storehousePositionsId) => {
            paramsOnChange({ ...params, storehousePositionsId });
          }}
          value={params.storehousePositionsId}
        />;
      case 'bom':
        return <Bom
          refresh={refresh}
          options={getOptions(item.key)}
          title={item.title}
          value={params.partsSkuId}
          onChange={(partsSkuId, type) => {
            paramsOnChange({ ...params, partsSkuId, selectBom: type });
          }}
        />;
      case 'time':
        return <Time
          title={item.title}
          value={params.startTime || params.endTime}
          onChange={(time) => {
            paramsOnChange({ ...params, ...time });
          }}
        />;
      case 'user':
        return <User
          title={item.title}
          value={params.createUser}
          onChange={(createUser) => {
            paramsOnChange({ ...params, createUser });
          }}
        />;
      case 'number':
        return <StockNumber
          title={item.title}
          mixNum={params.mixNum}
          maxNum={params.maxNum}
          mixNumChange={(mixNum) => {
            paramsOnChange({ ...params, mixNum });
          }}
          maxNumChange={(maxNum) => {
            paramsOnChange({ ...params, maxNum });
          }}
        />;
      default:
        return <></>;
    }
  };

  return <>
    <Screen
      screen={screen}
      buttonTitle={stockNumber === 0 ? '完成' : `查看 ${stockNumber} 件物料`}
      onClose={onClose}
      onClear={onClear}
      searchtype={searchtype.filter(item => item.open)}
      searchtypeScreened={searchtypeScreened}
      screenContent={screenContent}
      getOptions={getOptions}
      SideBarDisabled={SideBarDisabled}
    />
  </>;
};

export default SkuScreen;