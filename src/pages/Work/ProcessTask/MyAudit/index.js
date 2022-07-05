import React, { useRef, useState } from 'react';
import { ToolUtil } from '../../../components/ToolUtil';
import { Tabs } from 'antd-mobile';
import { useBoolean } from 'ahooks';

import topStyle from '../../../global.less';
import ProcessList from '../ProcessList';
import MySearch from '../../../components/MySearch';
import ProcessScreen from './components/ProcessScreen';
import style from '../../Sku/SkuList/index.less';
import Icon from '../../../components/Icon';


const MyAudit = () => {

  const [screen, { setTrue, setFalse }] = useBoolean();

  const [key, setKey] = useState('wait');

  const [number, setNumber] = useState(0);

  const [params, setParams] = useState({});

  const [sort, setSort] = useState({ field: 'createTime', order: 'ascend' });

  const [screening, setScreeing] = useState();

  const listRef = useRef();

  const screenRef = useRef();

  const submit = (data, newSort = {}) => {
    const newParmas = { ...params, ...data };
    setParams(newParmas);
    setScreeing(true);
    listRef.current.submit(newParmas, { ...sort, ...newSort });
  };

  const sortAction = (field) => {
    let order = 'descend';
    if (sort.field === field) {
      switch (sort.order) {
        case 'ascend':
          order = 'descend';
          break;
        case 'descend':
          order = 'ascend';
          break;
        default:
          order = 'descend';
          break;
      }
    }
    setSort({ field, order });
    submit({}, { field, order });
  };

  const sortShow = (field) => {

    if (sort.field !== field) {
      return <Icon type='icon-paixu' />;
    }

    switch (sort.order) {
      case  'ascend' :
        return <Icon type='icon-paixubeifen' />;
      case  'descend' :
        return <Icon type='icon-paixubeifen2' />;
      default:
        return <Icon type='icon-paixu' />;
    }
  };

  const processListRef = useRef();

  return <>
    <MySearch placeholder='请输入相关单据信息' historyType='process' />
    <Tabs activeKey={key} onChange={(key) => {
      switch (key) {
        case 'wait':
          submit({ auditType: 'audit', status: 0 });
          break;
        case 'processed':
          submit({ auditType: 'audit', status: 99 });
          break;
        case 'send':
          submit({ auditType: 'send' });
          break;
        default:
          break;
      }
      setKey(key);
    }} className={topStyle.tab}>
      <Tabs.Tab title='待处理' key='wait' />
      <Tabs.Tab title='已处理' key='processed' />
      <Tabs.Tab title='抄送我' key='send' />
    </Tabs>
    <div
      className={topStyle.top}
      style={{
        top: ToolUtil.isQiyeWeixin() ? 0 : 45,
        height: 45,
        backgroundColor: '#fff',
      }}
    >
      <div
        className={style.screen}
        ref={screenRef}
      >
        <div className={style.stockNumber}>数量：<span>{number}</span>
        </div>
        <div className={style.blank} />
        <div className={style.sort} onClick={() => {
          sortAction('createTime');
        }}>
          创建时间
          {sortShow('createTime')}
        </div>
        <div
          className={ToolUtil.classNames(style.screenButton, screen && style.checked, screening && style.checking)}
          onClick={() => {
            if (screen) {
              ToolUtil.isObject(processListRef.current).removeAttribute('style');
              setFalse();
            } else {
              ToolUtil.isObject(processListRef.current).setAttribute('style', 'min-height:100vh');
              screenRef.current.scrollIntoView();
              setTrue();
            }
          }}
        >
          筛选 <Icon type='icon-shaixuan' />
          <div>
            <svg viewBox='0 0 30 30' className={style.leftCorner}>
              <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
                <path d='M30,0 C13.4314575,3.04359188e-15 -2.02906125e-15,13.4314575 0,30 L0,30 L0,0 Z'
                      fill='var(--adm-color-white)'
                      transform='translate(15.000000, 15.000000) scale(-1, -1) translate(-15.000000, -15.000000) ' />
              </g>
            </svg>
            <svg viewBox='0 0 30 30' className={style.rightCorner}>
              <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
                <path d='M30,0 C13.4314575,3.04359188e-15 -2.02906125e-15,13.4314575 0,30 L0,30 L0,0 Z'
                      fill='var(--adm-color-white)'
                      transform='translate(15.000000, 15.000000) scale(-1, -1) translate(-15.000000, -15.000000) ' />
              </g>
            </svg>
          </div>


        </div>
      </div>
    </div>

    <ProcessList setNumber={setNumber} listRef={listRef} processListRef={processListRef} />

    <ProcessScreen
      skuNumber={number}
      onClose={() => {
        setFalse();
        ToolUtil.isObject(processListRef.current).removeAttribute('style');
      }}
      params={params}
      onClear={() => {
        screening(false);
        submit({ auditType: 'audit', status: 0 });
      }}
      screen={screen}
      onChange={(params) => {
        submit(params);
      }} />

  </>;
};

export default MyAudit;
