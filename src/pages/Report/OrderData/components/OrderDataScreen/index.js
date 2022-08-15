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
    { key: 'user', title: '执行人', open: true },
    { key: 'time', title: '时间', open: true },
  ];

  const user = params.user;
  const time = params.time;

  const paramsOnChange = (data) => {
    onChange(data);
  };

  const searchtypeScreened = (key) => {
    let screened = false;
    switch (key) {
      case 'createUser':
        screened = user;
        break;
      case 'time':
        screened = time;
        break;
      default:
        break;
    }
    return { screened };
  };

  const screenContent = (item) => {
    switch (item.key) {
      case 'user':
        return <User
          title={item.title}
          value={user}
          onChange={(user) => {
            paramsOnChange({ ...params, user });
          }}
        />;
      case 'time':
        return <Time
          title={item.title}
          value={time}
          onChange={(time) => {
            paramsOnChange({ ...params, time });
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
