import React, { useEffect, useRef, useState } from 'react';
import { ToolUtil } from '../../../components/ToolUtil';
import ProcessList from '../ProcessList';
import MySearch from '../../../components/MySearch';
import ProcessScreen from './components/ProcessScreen';
import ListScreent from '../../Sku/SkuList/components/ListScreent';


const MyAudit = (
  {
    auditType,
    type,
    paramsChange = () => {
    },
    createUser,
    top = ToolUtil.isQiyeWeixin() ? 0 : 45,
    listScreentTop,
    ReceiptDom,
    hiddenSearch,
  }) => {

  const [screen, setScreen] = useState();

  const [number, setNumber] = useState(0);

  const defaultParams = { auditType, statusList: ['0'], types: type && [type], createUser };
  const defaultSort = { field: 'createTime', order: 'ascend' };

  const [params, setParams] = useState({});

  const [sort, setSort] = useState();

  const [screening, setScreeing] = useState();

  const listRef = useRef();
  const screenRef = useRef();

  const submit = (data = {}, newSort = {}) => {
    const newParmas = { ...params, ...data };
    setParams(newParmas);
    paramsChange(newParmas);
    setScreeing(true);
    listRef.current.submit(newParmas, { ...sort, ...newSort });
  };

  const clear = () => {
    setParams(defaultParams);
    paramsChange(defaultParams);
    setSort(defaultSort);
    listRef.current.submit(defaultParams, defaultSort);
  };

  useEffect(() => {
    clear();
  }, [auditType, type]);

  const processListRef = useRef();
  return <>
    <div hidden={type || hiddenSearch}>
      <MySearch
        placeholder='请输入单据相关信息'
        historyType='process'
        onSearch={(value) => {
          submit({ skuName: value });
        }}
        onClear={() => {
          submit({ skuName: '' });
        }}
      />
    </div>


    <ListScreent
      top={typeof listScreentTop === 'number' ? listScreentTop : top}
      setSort={setSort}
      sort={sort}
      screening={screening}
      submit={submit}
      onlySorts={['createTime']}
      sorts={[{ field: 'createTime', title: '时间' }]}
      listRef={processListRef}
      screen={screen}
      screenChange={setScreen}
      screenRef={screenRef}
      numberTitle={<>数量：<span>{number}</span></>}
    />

    <ProcessList
      ReceiptDom={ReceiptDom}
      all={ToolUtil.isArray(params.statusList).includes('99')}
      setNumber={setNumber}
      listRef={listRef}
      processListRef={processListRef}
    />

    <ProcessScreen
      top={top}
      open={{ type: !type, createUser: !createUser }}
      skuNumber={number}
      onClose={() => {
        setScreen(false);
        ToolUtil.isObject(processListRef.current).removeAttribute('style');
      }}
      params={params}
      onClear={clear}
      screen={screen}
      onChange={(params) => {
        submit(params);
      }} />

  </>;
};

export default MyAudit;
