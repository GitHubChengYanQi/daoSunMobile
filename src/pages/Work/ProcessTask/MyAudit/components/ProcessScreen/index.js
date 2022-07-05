import React from 'react';
import Screen from '../../../../../components/Screen';
import State from '../../../../Sku/SkuList/components/SkuScreen/components/State';
import { ReceiptsEnums } from '../../../../../Receipts';
import User from '../../../../Sku/SkuList/components/SkuScreen/components/User';

const ProcessScreen = (
  {
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
    { key: 'type', title: '任务类型', open: true },
    { key: 'status', title: '状态', open: true },
    { key: 'createUser', title: '发起人', open: true },
  ];

  const type = params.type;
  const createUser = params.createUser;

  const paramsOnChange = (data) => {
    onChange(data);
  };

  const searchtypeScreened = (key) => {
    let screened = false;
    switch (key) {
      case 'type':
        screened = type;
        break;
      case 'status':
        screened = true;
        break;
      case 'createUser':
        screened = createUser;
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
          options={[
            { label: '入库任务', value: ReceiptsEnums.instockOrder },
            { label: '出库任务', value: ReceiptsEnums.outstockOrder },
            { label: '异常任务', value: ReceiptsEnums.instockError },
            { label: '盘点任务', value: ReceiptsEnums.stocktaking },
            { label: '养护任务', value: ReceiptsEnums.maintenance },
          ]}
          title='单据类型'
          value={[params.type]}
          onChange={(types) => {
            paramsOnChange({ ...params, type: types[0] });
          }}
        />;
      case 'status':
        return <State
          options={[
            { label: '待处理', value: 0 },
            { label: '已处理', value: 99 },
          ]}
          title='单据类型'
          value={[params.status]}
          onChange={(status) => {
            paramsOnChange({ ...params, status: status[0] });
          }}
        />;
      case 'createUser':
        return <User
          title={item.title}
          value={params.createUser}
          onChange={(createUser) => {
            paramsOnChange({ ...params, createUser });
          }}
        />;
      default:
        return <></>;
    }
  };

  return <>
    <Screen
      top={78}
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
