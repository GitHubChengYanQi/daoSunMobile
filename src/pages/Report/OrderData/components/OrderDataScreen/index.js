import React from 'react';
import User from '../../../../Work/Sku/SkuList/components/SkuScreen/components/User';
import Screen from '../../../../components/Screen';
import Time from '../../../../Work/Sku/SkuList/components/SkuScreen/components/Time';
import Supply from '../../../../Work/Sku/SkuList/components/SkuScreen/components/Supply';
import StoreHouse from '../../../../Work/Sku/SkuList/components/SkuScreen/components/StoreHouse';
import State from '../../../../Work/Sku/SkuList/components/SkuScreen/components/State';

const OrderDataScreen = (
  {
    top,
    screen,
    skuNumber,
    params = {},
    onClose = () => {
    },
    onChange = () => {
    },
    onClear = () => {
    },
    orderType,
  },
) => {

  const searchtype = [
    { key: 'createUser', title: '执行人', open: true },
    { key: 'customer', title: '供应商', open: ['instockLog'].includes(orderType) },
    { key: 'pickUser', title: '领料人', open: ['outstockLog'].includes(orderType) },
    { key: 'storeHouse', title: '仓库', open: ['outstockLog'].includes(orderType) },
    { key: 'outStoreHouse', title: '调出仓库', open: ['allocationLog'].includes(orderType) },
    { key: 'inStoreHouse', title: '调入仓库', open: ['allocationLog'].includes(orderType) },
    { key: 'outUser', title: '出货人', open: ['allocationLog'].includes(orderType) },
    { key: 'inUser', title: '收货人', open: ['allocationLog'].includes(orderType) },
    { key: 'type', title: '类型', open: ['anomaly'].includes(orderType) },
    { key: 'dateParams', title: '时间', open: true },
  ];

  const createUser = params.createUser;
  const dateParams = params.dateParams;
  const customer = params.customer;
  const pickUser = params.pickUser;
  const storeHouse = params.storeHouse;
  const inStoreHouse = params.inStoreHouse;
  const outStoreHouse = params.outStoreHouse;
  const outUser = params.outUser;
  const inUser = params.inUser;
  const type = params.type;

  const paramsOnChange = (data) => {
    onChange(data);
  };

  const searchtypeScreened = (key) => {
    let screened = false;
    switch (key) {
      case 'createUser':
        screened = createUser;
        break;
      case 'dateParams':
        screened = dateParams;
        break;
      case 'outUser':
        screened = outUser;
        break;
      case 'inUser':
        screened = inUser;
        break;
      case 'type':
        screened = type;
        break;
      case 'pickUser':
        screened = pickUser;
        break;
      case 'storeHouse':
        screened = storeHouse;
        break;
      case 'outStoreHouse':
        screened = outStoreHouse;
        break;
      case 'inStoreHouse':
        screened = inStoreHouse;
        break;
      case 'customer':
        screened = customer;
        break;
      default:
        break;
    }
    return { screened };
  };

  const screenContent = (item) => {
    switch (item.key) {
      case 'createUser':
        return <User
          title={item.title}
          value={createUser}
          onChange={(createUser) => {
            paramsOnChange({ ...params, createUser });
          }}
        />;
      case 'outUser':
        return <User
          title={item.title}
          value={outUser}
          onChange={(outUser) => {
            paramsOnChange({ ...params, outUser });
          }}
        />;
      case 'inUser':
        return <User
          title={item.title}
          value={inUser}
          onChange={(inUser) => {
            paramsOnChange({ ...params, inUser });
          }}
        />;
      case 'type':
        return <State
          options={[{ label: '盘点', value: 'stocktasking' }, { label: '入库', value: 'inStock' }]}
          title={item.title}
          value={type}
          onChange={(type) => {
            paramsOnChange({ ...params, type });
          }}
        />;
      case 'pickUser':
        return <User
          title={item.title}
          value={pickUser}
          onChange={(pickUser) => {
            paramsOnChange({ ...params, pickUser });
          }}
        />;
      case 'storeHouse':
        return <StoreHouse
          title={item.title}
          value={storeHouse}
          onChange={(storeHouse) => {
            paramsOnChange({ ...params, storeHouse });
          }}
        />;
      case 'outStoreHouse':
        return <StoreHouse
          title={item.title}
          value={outStoreHouse}
          onChange={(outStoreHouse) => {
            paramsOnChange({ ...params, outStoreHouse });
          }}
        />;
      case 'inStoreHouse':
        return <StoreHouse
          title={item.title}
          value={inStoreHouse}
          onChange={(inStoreHouse) => {
            paramsOnChange({ ...params, inStoreHouse });
          }}
        />;
      case 'customer':
        return <Supply
          refresh
          overLength
          title={item.title}
          value={customer}
          onChange={(customer) => {
            paramsOnChange({ ...params, customer });
          }}
        />;
      case 'dateParams':
        return <Time
          title={item.title}
          value={dateParams}
          onChange={(dateParams) => {
            paramsOnChange({ ...params, dateParams });
          }}
        />;
      default:
        return <></>;
    }
  };

  return <>
    <Screen
      noNavBar={top === 0}
      screen={screen}
      buttonTitle={skuNumber === 0 ? '完成' : `查看 ${skuNumber} 个单据`}
      onClose={onClose}
      onClear={onClear}
      searchtype={searchtype.filter(item => item.open)}
      searchtypeScreened={searchtypeScreened}
      screenContent={screenContent}
    />
  </>;
};

export default OrderDataScreen;
