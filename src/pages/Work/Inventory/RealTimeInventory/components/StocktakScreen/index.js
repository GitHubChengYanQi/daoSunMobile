import React from 'react';
import Screen from '../../../../../components/Screen';
import User from '../../../../Sku/SkuList/components/SkuScreen/components/User';
import Position from '../../../../Sku/SkuList/components/SkuScreen/components/Position';
import { useRequest } from '../../../../../../util/Request';
import { positions } from '../../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/InstockOrder/components/InstockShop/components/Positions';
import { MyLoading } from '../../../../../components/MyLoading';
import Time from '../../../../Sku/SkuList/components/SkuScreen/components/Time';

const StocktakScreen = (
  {
    getContainer,
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
    open = {},
  },
) => {

  const searchtype = [
    { key: 'positions', title: '库位', open: true },
    { key: 'createUser', title: '盘点人', open: true },
    { key: 'createTime', title: '盘点时间', open: true },
  ];

  const positionId = params.positionId;
  const createUser = params.createUser;
  const startTime = params.startTime;
  const endTime = params.endTime;

  const { loading, data } = useRequest(positions);


  const paramsOnChange = (data) => {
    onChange(data);
  };

  const searchtypeScreened = (key) => {
    let screened = false;
    switch (key) {
      case 'positions':
        screened = positionId;
        break;
      case 'createUser':
        screened = createUser;
        break;
      case 'createTime':
        screened = startTime || endTime;
        break;
      default:
        break;
    }
    return { screened };
  };

  const screenContent = (item) => {
    switch (item.key) {
      case 'positions':
        return loading ? <MyLoading skeleton /> : <Position
          title={item.title}
          options={data}
          onChange={(positionId) => {
            paramsOnChange({ ...params, positionId });
          }}
          value={positionId}
        />;
      case 'createUser':
        return <User
          placeholder='请输入人员信息'
          title={item.title}
          value={createUser}
          onChange={(createUser) => {
            paramsOnChange({ ...params, createUser });
          }}
        />;
      case 'createTime':
        return <Time
          getContainer={getContainer}
          title={item.title}
          value={[startTime, endTime]}
          onChange={(createTime) => {
            paramsOnChange({ ...params, startTime: createTime[0], endTime: createTime[1] });
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

export default StocktakScreen;
