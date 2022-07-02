import React from 'react';
import Screen from '../../../../../components/Screen';
import State from '../../../../Sku/SkuList/components/SkuScreen/components/State';
import { ReceiptsEnums } from '../../../../../Receipts';

const ProcessScreen = (
  {
    screen,
    skuNumber,
    params = {},
    onClose=()=>{},
    onChange=()=>{},
    onClear=()=>{},
  },
) => {

  const searchtype = [
    { key: 'type', title: '单据类型', open: true },
  ];

  const type = params.type;

  const paramsOnChange = (data) => {
    onChange(data);
  };

  const searchtypeScreened = (key) => {
    let screened = false;
    switch (key) {
      case 'type':
        screened = type;
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
            { label: '入库单', value: ReceiptsEnums.instockOrder },
            { label: '出库单', value: ReceiptsEnums.outstockOrder },
            { label: '异常单', value: ReceiptsEnums.instockError },
            { label: '盘点单', value: ReceiptsEnums.stocktaking },
            { label: '养护单', value: ReceiptsEnums.maintenance },
          ]}
          title='单据类型'
          value={[params.type]}
          onChange={(types) => {
            paramsOnChange({ ...params, type:types[0] });
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
