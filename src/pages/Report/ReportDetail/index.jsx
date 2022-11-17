import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MySearch from '../../components/MySearch';
import style from '../../Work/ProcessTask/index.less';
import styles from './index.less';
import { Button, Space, Tabs } from 'antd-mobile';
import moment from 'moment';
import { classNames, isObject } from '../../components/ToolUtil';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import MyNavBar from '../../components/MyNavBar';
import StartEndDate from '../../Work/Production/CreateTask/components/StartEndDate';
import CheckUser from '../../components/CheckUser';
import SkuClass from '../../Work/ProcessTask/MyAudit/components/SkuClass';
import MyRadio from '../../components/MyRadio';
import OutAsk from './components/OutAsk';
import Customers from '../../Work/ProcessTask/MyAudit/components/Customers';
import MyActionSheet from '../../components/MyActionSheet';
import InAsk from './components/InAsk';
import MyPicker from '../../components/MyPicker';

const ReportDetail = () => {

  const { query = {} } = useLocation();

  const userRef = useRef();
  const createUserRef = useRef();
  const dataRef = useRef();

  const listRef = useRef();

  const defaultParams = {};

  const [params, setParams] = useState(defaultParams);

  const [exportVisible, setExportVisible] = useState(false);

  const [key, setKey] = useState();

  const [screenKey, setScreenkey] = useState();

  const [screen, setScreen] = useState({});

  const [checkAll, setCheckAll] = useState(false);
  const [currentAll, setCurrentAll] = useState(false);

  const submit = (data = {}, reset) => {
    const newParmas = reset ? { ...defaultParams, ...data } : { ...params, ...data };
    if (reset) {
      setScreen({});
    }
    setParams(newParmas);
    listRef.current?.submit(newParmas);
  };

  let title = '';
  let tabs = [];
  let content = <></>;

  switch (query.type) {
    case 'outAskNumber':
      title = '出库申请排行';
      tabs = [
        {
          title: '任务次数',
          key: 'ORDER_BY_CREATE_USER',
          screens: [
            { title: '日期', key: 'createTime' },
            { title: '领料人', key: 'pickUserId' },
          ],
        },
        {
          title: '物料数量',
          key: 'ORDER_BY_DETAIL',
          screens: [
            { title: '日期', key: 'createTime' },
            { title: '物料分类', key: 'skuClass' },
          ],
        },
      ];
      content = <OutAsk listRef={listRef} params={params} />;
      break;
    case 'inAskNumber':
      title = '入库申请排行';
      tabs = [
        {
          title: '申请次数',
          key: 'ORDER_BY_CREATE_USER',
          screens: [
            { title: '日期', key: 'createTime' },
            { title: '供应商', key: 'customerId' },
          ],
        },
        {
          title: '物料数量',
          key: 'ORDER_BY_DETAIL',
          screens: [
            { title: '日期', key: 'createTime' },
            { title: '物料分类', key: 'skuClass' },
          ],
        },
      ];
      content = <InAsk listRef={listRef} params={params} />;
      break;
    case 'inStock':
      title = '工作明细';
      tabs = [
        {
          title: '申请次数',
          key: 'ORDER_BY_CREATE_USER',
          screens: [
            { title: '日期', key: 'createTime' },
            { title: '物料分类', key: 'skuClass' },
            { title: '数量排行', key: 'ranking' },
          ],
        },
      ];
      // content = <InAsk listRef={listRef} params={params} />;
      break;
  }

  const [screens, setScreens] = useState(tabs[0]?.screens || []);

  useEffect(() => {
    submit({ searchType: tabs[0]?.key });
  }, []);

  return <>
    <MyNavBar title={title} />
    <MySearch placeholder='搜索' />
    <div className={style.space} />
    <div hidden={tabs.length <= 1} className={styles.tabs}>
      <Tabs onChange={(key) => {
        const tabItem = tabs.find(item => item.key === key);
        setScreens(tabItem.screens);
        setKey(key);
        submit({ searchType: key }, true);
      }} activeKey={key}>
        {
          tabs.map(item => {
            return <Tabs.Tab {...item} />;
          })
        }
      </Tabs>
    </div>

    <div
      style={{ borderBottom: ' 1px solid var(--body--background--color)' }}
      className={style.screent}
    >
      <div className={style.dropDown}>
        {
          screens.map((item) => {
            let title = '';
            switch (item.key) {
              case 'pickUserId':
                title = screen.userName;
                break;
              case 'createTime':
                title = params.beginTime ? moment(params.beginTime).format('MM/DD') + '-' + moment(params.endTime).format('MM/DD') : '';
                break;
              case 'customerId':
                title = screen.customerName;
                break;
              case 'skuClass':
                title = screen.skuClassName;
                break;
              case 'ranking':
                title = screen.ranking;
                break;
            }
            const check = title || screenKey === item.key;
            return <div
              style={{ width: `${parseInt(100 / screens.length)}%` }}
              className={classNames(style.titleBox, check && style.checked)}
              key={item.key}
              onClick={() => {
                switch (item.key) {
                  case 'createUser':
                    createUserRef.current.open();
                    break;
                  case 'pickUserId':
                    userRef.current.open();
                    break;
                  case 'createTime':
                    dataRef.current.open();
                    break;
                  default:
                    break;
                }
                setScreenkey(item.key);
              }}>
              <div className={style.title} style={{ minWidth: '80%', textAlign: 'center' }}>{title || item.title}</div>
              {screenKey === item.key ? <UpOutline /> : <DownOutline />}
            </div>;
          })
        }
      </div>
    </div>
    {content}
    <div className={styles.bottomAction}>
      <Space className={styles.radio}>
        <MyRadio checked={currentAll} onChange={() => {
          setCheckAll(false);
          setCurrentAll(true);
        }}>本页全选</MyRadio>
        <MyRadio checked={checkAll} onChange={() => {
          setCurrentAll(false);
          setCheckAll(true);
        }}>全部全选</MyRadio>
      </Space>

      <Button color='primary' onClick={() => {
        setExportVisible(true);
        // exportRun({ data: { beginTime: date[0], endTime: date[1] } });
      }}>
        导出
      </Button>
    </div>

    <StartEndDate
      render
      onClose={() => setScreenkey('')}
      precision='day'
      minWidth='100%'
      textAlign='left'
      value={params.beginTime ? [params.beginTime, params.endTime] : []}
      max={new Date()}
      onChange={(creatTime) => {
        submit({ beginTime: creatTime[0], endTime: creatTime[1] });
        setScreenkey('');
      }}
      dataRef={dataRef}
    />

    <CheckUser
      zIndex={1002}
      ref={userRef}
      onClose={() => setScreenkey('')}
      value={params.pickUserId ? [{ id: params.pickUserId }] : []}
      onChange={(users) => {
        submit({ pickUserId: isObject(users[0]).id });
        setScreen({ ...screen, userName: isObject(users[0]).name });
        setScreenkey('');
      }}
    />

    <SkuClass
      onClose={() => setScreenkey('')}
      zIndex={1002}
      value={params.skuClassId ? [{ value: params.skuClassId, label: screen.skuClassName }] : []}
      visible={screenKey === 'skuClass'}
      onChange={(skuClass = []) => {
        submit({ skuClassId: skuClass[0]?.value });
        setScreen({ ...screen, skuClassName: skuClass[0]?.label });
        setScreenkey('');
      }}
    />

    <Customers
      onClose={() => setScreenkey('')}
      zIndex={1002}
      value={params.customerId ? [{ customerId: params.customerId, customerName: screen.customerName }] : []}
      visible={screenKey === 'customerId'}
      onChange={(customer) => {
        submit({ customerId: customer?.customerId });
        setScreen({ ...screen, customerName: customer?.customerName });
        setScreenkey('');
      }}
    />

    <MyPicker
      visible={screenKey === 'ranking'}
      value={params.ranking}
      onChange={(option) => {
        submit({ ranking: option.value });
        setScreen({ ...screen, ranking: option.label });
        setScreenkey('');
      }}
      options={[
        { label: '计算次数', value: 'count' },
        { label: '计算件数', value: 'number' },
      ]}
      onClose={() => setScreenkey('')}
    />


    <MyActionSheet
      visible={exportVisible}
      actions={[{ key: 'excel', text: '导出Excel' }, { key: 'pdf', text: '导出PDF' }]}
      onAction={(action) => {
        console.log(action);
      }}
      onClose={() => setExportVisible(false)}
    />
  </>;
};

export default ReportDetail;
