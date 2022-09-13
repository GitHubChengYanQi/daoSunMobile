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
import Material from './components/Material';

const SkuScreen = (
  {
    screen,
    overLengths,
    refresh,
    skuNumber,
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
    { key: 'brand', title: '品牌', open: true },
    { key: 'material', title: '材质', open: true },
    { key: 'state', title: '状态', open: true },
    { key: 'position', title: '库位', open: true },
    { key: 'supply', title: '供应商', open: true },
    // { key: 'user', title: '创建人', open: false },
    { key: 'number', title: '库存数量', open: true },
    { key: 'bom', title: '物料清单', open: true },
    // { key: 'time', title: '创建时间', open: open.time },
  ];

  const spuClassIds = ToolUtil.isArray(params.spuClassIds);
  const customerIds = ToolUtil.isArray(params.customerIds);
  const brandIds = ToolUtil.isArray(params.brandIds);
  const status = params.status;
  const partsSkuId = params.partsSkuId;
  const storehousePositionsId = params.storehousePositionsId;
  const time = params.startTime || params.endTime;
  const createUser = params.createUser;
  const mixNum = params.mixNum;
  const maxNum = params.maxNum;

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
        return [{ label: '存在异常件', value: -1 }];
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
        screened = status;
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
        screened = mixNum || maxNum;
        break;
      case 'material':
        screened = false;
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
      case 'position':
        return getOptions(key).length <= 1 && !screened && !overLength;
      case 'state':
      case 'bom':
      case 'time':
      case 'user':
      case 'material':
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
      case 'material':
        return <Material
          refresh={refresh}
          title={item.title}
          value={params.Material}
          onChange={(materialId) => {
            paramsOnChange({ ...params, materialId });
          }}
        />;
      case 'state':
        return <State
          columns={2}
          options={getOptions(item.key)}
          title={item.title}
          value={[status]}
          onChange={(status) => {
            paramsOnChange({ ...params, status: status[0] });
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
          numChange={(mixNum, maxNum) => {
            paramsOnChange({ ...params, mixNum, maxNum });
          }}
        />;
      default:
        return <></>;
    }
  };

  return <>
    <Screen
      screen={screen}
      buttonTitle={skuNumber === 0 ? '完成' : `查看 ${skuNumber} 类物料`}
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
