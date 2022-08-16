import React from 'react';
import User from '../../../../Work/Sku/SkuList/components/SkuScreen/components/User';
import Screen from '../../../../components/Screen';
import Time from '../../../../Work/Sku/SkuList/components/SkuScreen/components/Time';

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
  },
) => {

  const searchtype = [
    { key: 'createUser', title: '执行人', open: true },
    { key: 'dateParams', title: '时间', open: true },
  ];

  const createUser = params.createUser;
  const dateParams = params.dateParams;

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
