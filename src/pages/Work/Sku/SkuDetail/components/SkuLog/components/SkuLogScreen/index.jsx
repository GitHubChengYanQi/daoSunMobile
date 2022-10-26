import React from 'react';
import { ReceiptsEnums } from '../../../../../../../Receipts';
import { MyLoading } from '../../../../../../../components/MyLoading';
import Time from '../../../../../SkuList/components/SkuScreen/components/Time';
import User from '../../../../../SkuList/components/SkuScreen/components/User';
import State from '../../../../../SkuList/components/SkuScreen/components/State';
import Brand from '../../../../../SkuList/components/SkuScreen/components/Brand';
import { ToolUtil } from '../../../../../../../components/ToolUtil';
import Screen from '../../../../../../../components/Screen';
import styles from '../../index.less';
import Position from '../Position';

const SkuLogScreen = (
  {
    afterClose = () => {
    },
    loading,
    screen,
    skuNumber,
    params,
    onClose,
    onChange,
    onClear,
  },
) => {

  const searchtype = [
    { key: 'type', title: '类型', open: true },
    { key: 'time', title: '时间', open: true },
    { key: 'user', title: '操作人', open: true },
    { key: 'brand', title: '品牌', open: true },
    { key: 'position', title: '库位', open: true },
  ];

  const type = params.type;
  const brandIds = ToolUtil.isArray(params.brandIds);
  const storehousePositionsId = params.storehousePositionsId;
  const time = params.startTime || params.endTime;
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
      case 'brand':
        screened = brandIds.length > 0;
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
            { label: '盘点', value: ReceiptsEnums.stocktaking },
            { label: '养护', value: ReceiptsEnums.maintenance },
            { label: '调拨', value: ReceiptsEnums.allocation },
          ]}
          title={item.title}
          value={type}
          onChange={(type) => {
            paramsOnChange({ ...params, type });
          }}
        />;
      case 'brand':
        return <Brand
          overLength
          refresh
          title={item.title}
          value={params.brandIds}
          onChange={(brandIds) => {
            paramsOnChange({ ...params, brandIds });
          }}
        />;
      case 'position':
        return <Position
          title={item.title}
          onChange={(storehousePositionsId) => {
            paramsOnChange({ ...params, storehousePositionsId });
          }}
          value={params.storehousePositionsId}
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
      default:
        return <></>;
    }
  };

  return <>
    <Screen
      className={styles.popup}
      height={100}
      screen={screen}
      fill={loading && 'outline'}
      buttonTitle={loading ? <MyLoading
        imgWidth={10}
        loaderWidth={20}
        skeleton
        downLoading
        title='正在查找记录...'
        noLoadingTitle /> : `查看 ${skuNumber} 条记录`}
      onClose={onClose}
      afterClose={afterClose}
      onClear={onClear}
      searchtype={searchtype.filter(item => item.open)}
      searchtypeScreened={searchtypeScreened}
      screenContent={screenContent}
    />
  </>;
};

export default SkuLogScreen;
