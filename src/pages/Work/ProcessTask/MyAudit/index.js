import React, { useEffect, useRef, useState } from 'react';
import { ToolUtil } from '../../../components/ToolUtil';
import { Tabs } from 'antd-mobile';
import topStyle from '../../../global.less';
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
    top = ToolUtil.isQiyeWeixin() ? 0 : 45,
  }) => {

  const [screen, setScreen] = useState();

  const [number, setNumber] = useState(0);

  const defaultParams = { auditType, status: 0, type };
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
    <div hidden={type}>
      <MySearch placeholder='请输入相关单据信息' historyType='process' />
      <Tabs activeKey={params.status} onChange={(key) => {
        return submit({ status: key });
      }} className={topStyle.tab}>
        <Tabs.Tab title='待处理' key={0} />
        <Tabs.Tab title='已处理' key={99} />
      </Tabs>
    </div>


    <ListScreent
      top={top}
      setSort={setSort}
      sort={sort}
      screening={screening}
      submit={submit}
      onlySorts={['createTime']}
      sorts={[{ field: 'createTime', title: '创建时间' }]}
      listRef={processListRef}
      screen={screen}
      screenChange={setScreen}
      screenRef={screenRef}
      numberTitle={<>数量：<span>{number}</span></>}
    />

    <ProcessList setNumber={setNumber} listRef={listRef} processListRef={processListRef} />

    <ProcessScreen
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
