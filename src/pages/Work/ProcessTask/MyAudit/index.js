import React, { useEffect, useRef, useState } from 'react';
import { classNames, isObject } from '../../../../util/ToolUtil';
import ProcessList from '../ProcessList';
import MySearch from '../../../components/MySearch';
import style from '../index.less';
import { Tabs } from 'antd-mobile';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import Icon from '../../../components/Icon';
import TaskTypes from './components/TaskTypes';
import CheckUser from '../../../components/CheckUser';
import moment from 'moment';
import { ReceiptsEnums } from '../../../Receipts';
import Customers from './components/Customers';
import MyPicker from '../../../components/MyPicker';
import StartEndDate from '../../../components/StartEndDate';
import { connect } from 'dva';


const MyAudit = (
  {
    processList,
    dispatch = () => {
    },
    skuName,
    type,
    noType,
    paramsChange = () => {
    },
    createUser,
    ReceiptDom,
    taskSkuId,
    extraIcon,
    pickUserId,
    task,
    defaultScreen = {},
  }) => {
  // console.log(processList);
  const userRef = useRef();
  const createUserRef = useRef();
  const dataRef = useRef();

  const defaultParams = {
    skuName,
    type,
    createUser,
    skuId: taskSkuId,
    pickUserId,
  };
  let tabs = [];
  let params = { ...defaultParams, ...processList.createUserParams };
  let screen = { ...defaultScreen, ...processList.createUserScreen };
  let key = processList.auditKey;

  if (task) {
    params = { ...defaultParams, ...processList.taskParams };
    screen = { ...defaultScreen, ...processList.taskScreen };
    key = processList.taskAuditKey;
    tabs = [
      { title: '执行中', key: 'actioning' },
      { title: '已完成', key: 'complete' },
      { title: '已撤销', key: 'revoke' },
    ];
  } else if (!createUser) {
    params = { ...defaultParams, ...processList.params };
    screen = { ...defaultScreen, ...processList.screen };
    tabs = [
      { title: '待审批', key: 'audit' },
      { title: '已审批', key: 'audited' },
      { title: '抄送我', key: 'send' },
    ];
  }

  const [screenKey, setScreenkey] = useState();

  const defaultScreenDatas = noType ? [
    { title: createUser ? '任务状态' : '申请人', key: createUser ? 'status' : 'createUser' },
    { title: '提交日期', key: 'createTime' },
  ] : [
    { title: '任务类型', key: 'type' },
    { title: createUser ? '任务状态' : '申请人', key: createUser ? 'status' : 'createUser' },
    { title: '提交日期', key: 'createTime' },
  ];

  let screens = defaultScreenDatas;

  if (params.queryType === 2 || params.queryType === 3) {
    screens = [{ title: '审批状态', key: 'status' }, ...defaultScreenDatas];
  }

  if (!noType) {
    switch (params.type) {
      case ReceiptsEnums.instockOrder:
        screens.push({ title: '供应商', key: 'customerId' });
        break;
      case ReceiptsEnums.outstockOrder:
        screens.push({ title: '领料人', key: 'pickUserId' });
        break;
      default:
        break;
    }
  }

  const defaultSort = { field: 'createTime', order: localStorage.getItem('processTaskTimeSort') || 'ascend' };

  const [sort, setSort] = useState(defaultSort);

  const listRef = useRef();

  const submit = (data = {}, newSort = {}, reset) => {
    const newParmas = reset ? { ...defaultParams, ...data } : { ...params, ...data };
    onDispatchParams(newParmas);
    paramsChange(newParmas);
    listRef.current.submit(newParmas, { ...sort, ...newSort });
  };

  const resetScreen = (initParams = defaultParams) => {
    let typeName = '';
    switch (initParams.type) {
      case ReceiptsEnums.error:
        typeName = '异常';
        break;
      case ReceiptsEnums.outstockOrder:
        typeName = '出库';
        break;
      case ReceiptsEnums.instockOrder:
        typeName = '入库';
        break;
      case ReceiptsEnums.maintenance:
        typeName = '养护';
        break;
      case ReceiptsEnums.stocktaking:
        typeName = '盘点';
        break;
      case ReceiptsEnums.allocation:
        typeName = '调拨';
        break;
      default:
        break;
    }
    onDispatchScreen({ ...defaultScreen, typeName });
  };

  const onDispatchParams = (params) => {
    let type = '';
    let payload = '';
    if (task) {
      type = 'processList/taskParamsChange';
      payload = {
        taskParams: params,
      };
    } else if (createUser) {
      type = 'processList/createUserParamsChange';
      payload = {
        createUserParams: params,
      };
    } else {
      type = 'processList/paramsChange';
      payload = {
        params: params,
      };
    }
    dispatch({
      type,
      payload,
    });
  };

  const onDispatchScreen = (screen) => {
    let type = '';
    let payload = '';
    if (task) {
      type = 'processList/taskScreenChange';
      payload = {
        taskScreen: screen,
      };
    } else if (createUser) {
      type = 'processList/createUserScreenChange';
      payload = {
        createUserScreen: screen,
      };
    } else {
      type = 'processList/screenChange';
      payload = {
        screen: screen,
      };
    }
    dispatch({
      type,
      payload,
    });
  };

  const onDispatchAuditKey = (auditKey) => {
    let type = '';
    let payload = '';
    if (task) {
      type = 'processList/taskAuditKeyChange';
      payload = {
        taskAuditKey: auditKey,
      };
    } else {
      type = 'processList/auditKeyChange';
      payload = {
        auditKey: auditKey,
      };
    }
    dispatch({
      type,
      payload,
    });
  };

  const clear = () => {
    let initParams;
    if (task) {
      initParams = { ...defaultParams, status: '2' };
    } else if (createUser) {
      initParams = defaultParams;
    } else {
      initParams = { ...defaultParams, queryType: 1 };
    }
    setSearchValue('');
    onDispatchParams(initParams);
    resetScreen(initParams);
    paramsChange(initParams);
    setSort(defaultSort);
    listRef.current.submit(initParams, defaultSort);
  };

  useEffect(() => {
    if (task && type && type !== processList.taskParams.type) {
      clear();
    } else {
      listRef.current.submit(params, sort);
    }
  }, []);

  const processListRef = useRef();

  const [searchValue, setSearchValue] = useState(params.skuName || '');

  const sortShow = () => {
    switch (sort.order) {
      case  'ascend' :
        return <Icon type='icon-paixubeifen' />;
      case  'descend' :
        return <Icon type='icon-paixubeifen2' />;
      default:
        return <Icon type='icon-paixu' />;
    }
  };

  return <>
    <div>
      <MySearch
        className={style.search}
        extraIcon={extraIcon}
        placeholder='请输入单据相关信息'
        historyType='process'
        value={searchValue}
        onChange={setSearchValue}
        onSearch={(value) => {
          submit({ skuName: value });
        }}
        onClear={() => {
          submit({ skuName: '' });
        }}
      />
    </div>

    <div hidden={createUser} className={style.tabs}>
      <Tabs onChange={(key) => {
        switch (key) {
          case 'audit':
            submit({ queryType: 1 }, {}, true);
            break;
          case 'audited':
            submit({ queryType: 2 }, {}, true);
            break;
          case 'send':
            submit({ queryType: 3 }, {}, true);
            break;

          case 'actioning':
            submit({ status: '2' }, {}, true);
            break;
          case 'complete':
            submit({ status: '5' }, {}, true);
            break;
          case 'revoke':
            submit({ status: '6' }, {}, true);
            break;
          default:
            break;
        }
        resetScreen();
        onDispatchAuditKey(key);
      }} activeKey={key}>
        {
          tabs.map(item => {
            return <Tabs.Tab {...item} />;
          })
        }
      </Tabs>
    </div>

    <div className={style.screent}>
      <div className={style.dropDown}>
        {
          screens.map((item) => {
            let title = '';
            switch (item.key) {
              case 'type':
                title = screen.typeName;
                break;
              case 'createUser':
                title = screen.createUserName;
                break;
              case 'pickUserId':
                title = screen.userName;
                break;
              case 'createTime':
                title = params.startTime ? moment(params.startTime).format('MM/DD') + '-' + moment(params.endTime).format('MM/DD') : '';
                break;
              case 'customerId':
                title = screen.customerName;
                break;
              case 'status':
                title = screen.statusName;
                break;
            }
            const check = title || screenKey === item.key;
            return <div className={classNames(style.titleBox, check && style.checked)} key={item.key} onClick={() => {
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
              <div className={style.title}>{title || item.title}</div>
              {screenKey === item.key ? <UpOutline /> : <DownOutline />}
            </div>;
          })
        }
      </div>
      <div className={style.sort} onClick={() => {
        let order;
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
        localStorage.setItem('processTaskTimeSort', order);
        setSort({ field: 'createTime', order });
        submit({}, { field: 'createTime', order });
      }}>
        时间
        {sortShow()}
      </div>
    </div>

    <ProcessList
      noProgress={['audit', 'complete', 'audited'].includes(key) && !createUser}
      manual
      ReceiptDom={ReceiptDom}
      listRef={listRef}
      processListRef={processListRef}
    />

    <TaskTypes
      zIndex={1002}
      value={params.type}
      visible={screenKey === 'type'}
      onClose={() => setScreenkey('')}
      onChange={({ key, title }) => {
        submit({ type: key });
        onDispatchScreen({ ...screen, typeName: key ? title : '' });
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
        onDispatchScreen({ ...screen, customerName: customer?.customerName });
        setScreenkey('');
      }}
    />

    <CheckUser
      zIndex={1002}
      ref={createUserRef}
      onClose={() => setScreenkey('')}
      value={params.createUser ? [{ id: params.createUser }] : []}
      onChange={(users) => {
        submit({ createUser: isObject(users[0]).id });
        onDispatchScreen({ ...screen, createUserName: isObject(users[0]).name });
        setScreenkey('');
      }}
    />

    <CheckUser
      zIndex={1002}
      ref={userRef}
      onClose={() => setScreenkey('')}
      value={params.pickUserId ? [{ id: params.pickUserId }] : []}
      onChange={(users) => {
        submit({ pickUserId: isObject(users[0]).id });
        onDispatchScreen({ ...screen, userName: isObject(users[0]).name });
        setScreenkey('');
      }}
    />

    <StartEndDate
      render
      onClose={() => setScreenkey('')}
      precision='day'
      minWidth='100%'
      textAlign='left'
      value={params.startTime ? [params.startTime, params.endTime] : []}
      max={new Date()}
      onChange={(creatTime) => {
        submit({ startTime: creatTime[0], endTime: creatTime[1] });
        setScreenkey('');
      }}
      ref={dataRef}
    />

    <MyPicker
      value={params.status}
      visible={screenKey === 'status'}
      options={key === 'audited' ? [
        { label: '全部', value: 'all' },
        { label: '已通过', value: '5' },
        { label: '已驳回', value: '4' },
      ] : [
        { label: '全部', value: 'all' },
        { label: '审批中', value: '1' },
        { label: '执行中', value: '2' },
        // { label: '审批通过', value: '3' },
        { label: '审批驳回', value: '4' },
        { label: '已完成', value: '5' },
        { label: '任务撤回', value: '6' },
      ]}
      onClose={() => setScreenkey('')}
      onChange={(option) => {
        submit({ status: (option?.value && option?.value !== 'all') && option.value });
        onDispatchScreen({ ...screen, statusName: option.label });
        setScreenkey('');
      }}
    />

  </>;
};

export default connect(({ processList }) => ({ processList }))(MyAudit);
