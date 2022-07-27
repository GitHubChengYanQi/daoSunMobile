import React from 'react';
import Screen from '../../../../../components/Screen';
import State from '../../../../Sku/SkuList/components/SkuScreen/components/State';
import { ReceiptsEnums } from '../../../../../Receipts';
import User from '../../../../Sku/SkuList/components/SkuScreen/components/User';
import OutTime from '../../../../Sku/SkuList/components/SkuScreen/components/OutTime';

const ProcessScreen = (
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
    open = {},
  },
) => {

  const searchtype = [
    { key: 'type', title: '任务类型', open: open.type },
    { key: 'status', title: '状态', open: true },
    { key: 'createUser', title: '发起人', open: true },
    { key: 'outTime', title: '是否超期', open: true },
  ];

  const types = params.types || [];
  const createUser = params.createUser;
  const outTime = params.outTime;
  const statusList = params.statusList || [];

  const paramsOnChange = (data) => {
    onChange(data);
  };

  const searchtypeScreened = (key) => {
    let screened = false;
    switch (key) {
      case 'type':
        screened = types.length > 0;
        break;
      case 'status':
        screened = statusList.length > 0;
        break;
      case 'createUser':
        screened = createUser;
        break;
      case 'time':
        screened = outTime;
        break;
      default:
        break;
    }
    return { screened };
  };

  const screenContent = (item) => {
    switch (item.key) {
      case 'type':
        return <State
          multiple
          options={[
            { label: '入库', value: ReceiptsEnums.instockOrder },
            { label: '出库', value: ReceiptsEnums.outstockOrder },
            { label: '异常', value: ReceiptsEnums.error },
            { label: '盘点', value: ReceiptsEnums.stocktaking },
            { label: '养护', value: ReceiptsEnums.maintenance },
            { label: '调拨', value: ReceiptsEnums.allocation },
          ]}
          title={item.title}
          value={types}
          onChange={(types) => {
            paramsOnChange({ ...params, types });
          }}
        />;
      case 'status':
        return <State
          options={[
            { label: '待处理', value: '0' },
            { label: '已处理', value: '99' },
          ]}
          multiple
          title={item.title}
          value={statusList}
          onChange={(statusList = []) => {
            if (statusList.includes('99')) {
              statusList.push('50');
            } else {
              statusList = statusList.filter(item => item !== '50');
            }
            paramsOnChange({ ...params, statusList });
          }}
        />;
      case 'createUser':
        return <User
          title={item.title}
          value={createUser}
          onChange={(createUser) => {
            paramsOnChange({ ...params, createUser });
          }}
        />;
      case 'outTime':
        return <OutTime
          title={item.title}
          value={outTime}
          onChange={(outTime) => {
            paramsOnChange({ ...params, outTime });
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

export default ProcessScreen;
