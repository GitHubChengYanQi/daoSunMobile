import React from 'react';
import { ReceiptsEnums } from '../../../../../../../Receipts';
import { MyLoading } from '../../../../../../../components/MyLoading';
import Time from '../../../../../SkuList/components/SkuScreen/components/Time';
import User from '../../../../../SkuList/components/SkuScreen/components/User';
import State from '../../../../../SkuList/components/SkuScreen/components/State';
import Brand from '../../../../../SkuList/components/SkuScreen/components/Brand';
import { isArray, ToolUtil } from '../../../../../../../components/ToolUtil';
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
    { key: 'types', title: '类型', open: true },
    { key: 'time', title: '时间', open: true },
    { key: 'userIds', title: '操作人', open: true },
    { key: 'brandIds', title: '品牌', open: true },
    { key: 'positionId', title: '库位', open: true },
  ];

  const types = isArray(params.types);
  const brandIds = isArray(params.brandIds);
  const positionId = params.positionId;
  const startTime = params.startTime;
  const endTime = params.endTime;
  const userIds = isArray(params.userIds);

  const paramsOnChange = (data) => {
    onChange(data);
  };

  const searchtypeScreened = (key) => {
    let screened = false;
    switch (key) {
      case 'types':
        screened = types.length > 0;
        break;
      case 'brandIds':
        screened = brandIds.length > 0;
        break;
      case 'positionId':
        screened = positionId;
        break;
      case 'time':
        screened = startTime && endTime;
        break;
      case 'userIds':
        screened = userIds.length > 0;
        break;
      default:
        break;
    }
    return { screened };
  };

  const screenContent = (item) => {
    switch (item.key) {
      case 'types':
        return <State
          multiple
          options={[
            { label: '入库', value: ReceiptsEnums.instockOrder },
            { label: '出库', value: ReceiptsEnums.outstockOrder },
            { label: '盘点', value: ReceiptsEnums.stocktaking },
            { label: '养护', value: ReceiptsEnums.maintenance },
          ]}
          title={item.title}
          value={types}
          onChange={(types) => {
            paramsOnChange({ ...params, types });
          }}
        />;
      case 'brandIds':
        return <Brand
          overLength
          refresh
          title={item.title}
          value={brandIds}
          onChange={(brandIds) => {
            paramsOnChange({ ...params, brandIds });
          }}
        />;
      case 'positionId':
        return <Position
          title={item.title}
          onChange={(positions) => {
            paramsOnChange({ ...params, positionId: positions[0]?.id });
          }}
          value={positionId ? [{id:positionId}] : []}
        />;
      case 'time':
        return <Time
          title={item.title}
          value={(startTime && endTime) ? [startTime, endTime] : []}
          onChange={(time) => {
            paramsOnChange({ ...params, startTime: time[0], endTime: time[1] });
          }}
        />;
      case 'userIds':
        return <User
          multiple
          title={item.title}
          value={userIds}
          onChange={(userIds) => {
            paramsOnChange({ ...params, userIds });
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
