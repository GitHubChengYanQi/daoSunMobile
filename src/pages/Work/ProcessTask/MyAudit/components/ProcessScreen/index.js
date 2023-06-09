import React from 'react';
import Screen from '../../../../../components/Screen';
import State from '../../../../Sku/SkuList/components/SkuScreen/components/State';
import { ReceiptsEnums } from '../../../../../Receipts';
import User from '../../../../Sku/SkuList/components/SkuScreen/components/User';
import OutTime from '../../../../Sku/SkuList/components/SkuScreen/components/OutTime';
import Time from '../../../../Sku/SkuList/components/SkuScreen/components/Time';
import { MyLoading } from '../../../../../components/MyLoading';

const ProcessScreen = (
  {
    top,
    screen,
    skuNumber,
    params = {},
    getContainer,
    onClose = () => {
    },
    onChange = () => {
    },
    onClear = () => {
    },
    open = {},
    loading,
  },
) => {

  const searchtype = [
    { key: 'type', title: '类型', open: open.type },
    { key: 'status', title: '任务状态', open: true },
    { key: 'queryType', title: '审批状态', open: true },
    { key: 'createUser', title: '发起人', open: open.createUser },
    { key: 'outTime', title: '是否超期', open: true },
    { key: 'creatTime', title: '发起时间', open: true },
  ];

  const types = params.types || [];
  const createUser = params.createUser;
  const creatTime = params.startTime ? [params.startTime, params.endTime] : [];
  const outTime = params.outTime;
  const statusList = params.statusList || [];
  const queryType = params.queryType;

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
      case 'queryType':
        screened = queryType;
        break;
      case 'createUser':
        screened = createUser;
        break;
      case 'outTime':
        screened = outTime;
        break;
      case 'creatTime':
        screened = creatTime.length > 0;
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
            if (types.includes('ERROR')) {
              types.push('ErrorForWard');
            } else {
              types = types.filter(item => item !== 'ErrorForWard');
            }
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
              statusList.push('49');
            } else {
              statusList = statusList.filter(item => item !== '50');
            }
            paramsOnChange({ ...params, statusList });
          }}
        />;
      case 'queryType':
        return <State
          options={[
            { label: '待审批', value: '1' },
            { label: '抄送我', value: '2' },
          ]}
          title={item.title}
          value={[queryType]}
          onChange={(queryType = []) => {
            paramsOnChange({ ...params, queryType: queryType[0] });
          }}
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
      case 'outTime':
        return <OutTime
          title={item.title}
          value={outTime}
          onChange={(outTime) => {
            paramsOnChange({ ...params, outTime });
          }}
        />;
      case 'creatTime':
        return <Time
          getContainer={getContainer}
          max={new Date()}
          title={item.title}
          value={creatTime}
          onChange={(creatTime) => {
            paramsOnChange({ ...params, startTime: creatTime[0], endTime: creatTime[1] });
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
      fill={loading && 'outline'}
      buttonTitle={loading ? <MyLoading
        imgWidth={10}
        loaderWidth={20}
        skeleton
        downLoading
        title='正在查找单据...'
        noLoadingTitle /> : `查看 ${skuNumber} 个单据`}
      onClose={onClose}
      onClear={onClear}
      searchtype={searchtype.filter(item => item.open)}
      searchtypeScreened={searchtypeScreened}
      screenContent={screenContent}
    />
  </>;
};

export default ProcessScreen;
