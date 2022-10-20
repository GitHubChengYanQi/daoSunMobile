import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { classNames, isArray, isObject, ToolUtil } from '../../../components/ToolUtil';
import ProcessList from '../ProcessList';
import MySearch from '../../../components/MySearch';
import style from '../index.less';
import { Tabs } from 'antd-mobile';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import Icon from '../../../components/Icon';
import TaskTypes from './components/TaskTypes';
import CheckUser from '../../../components/CheckUser';
import StartEndDate from '../../Production/CreateTask/components/StartEndDate';
import moment from 'moment';
import { ReceiptsEnums } from '../../../Receipts';
import Customers from './components/Customers';
import MyPicker from '../../../components/MyPicker';


const MyAudit = (
  {
    auditType,
    skuName,
    type,
    defaultType,
    paramsChange = () => {
    },
    createUser,
    ReceiptDom,
    hiddenSearch,
    taskSkuId,
    extraIcon,
    task,
  }, ref) => {

  const userRef = useRef();
  const createUserRef = useRef();
  const dataRef = useRef();

  const defaultParams = {
    skuName,
    type,
    createUser,
    skuId: taskSkuId,
  };

  let tabs;

  if (task) {
    defaultParams.status = '2';
    tabs = [
      { title: '执行中', key: 'actioning' },
      { title: '已完成', key: 'complete' },
      { title: '被撤销', key: 'revoke' },
    ];
  } else {
    defaultParams.queryType = 1;
    tabs = [
      { title: '待审批', key: 'audit' },
      { title: '已审批', key: 'audited' },
      { title: '抄送我', key: 'send' },
    ];
  }

  const [params, setParams] = useState(defaultParams);

  const [key, setKey] = useState(task ? 'actioning' : 'audit');

  const [screenKey, setScreenkey] = useState();

  const defaultScreenDatas = [
    { title: '任务类型', key: 'type' },
    { title: createUser ? '任务状态' : '申请人', key: createUser ? 'status' : 'createUser' },
    { title: '提交日期', key: 'createTime' },
  ];

  switch (params.type) {
    case ReceiptsEnums.instockOrder:
      defaultScreenDatas.push({ title: '供应商', key: 'customerId' });
      break;
    case ReceiptsEnums.outstockOrder:
      defaultScreenDatas.push({ title: '领料人', key: 'pickUserId' });
      break;
    default:
      break;
  }

  const [screenDatas, setScreenDatas] = useState(defaultScreenDatas);

  const defaultSort = { field: 'createTime', order: localStorage.getItem('processTaskTimeSort') || 'ascend' };

  const [screen, setScreen] = useState({});

  const [sort, setSort] = useState({});

  const listRef = useRef();

  const submit = (data = {}, newSort = {}) => {
    const newParmas = { ...params, ...data };
    setParams(newParmas);
    paramsChange(newParmas);
    listRef.current.submit(newParmas, { ...sort, ...newSort });
  };

  useImperativeHandle(ref, () => {
    return {
      submit,
    };
  });

  const clear = () => {
    if (defaultParams.type) {
      let typeName = '';
      switch (defaultParams.type) {
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
      setScreen({ typeName });
    }
    setParams(defaultParams);
    paramsChange(defaultParams);
    setScreenDatas(defaultScreenDatas);
    setKey(task ? 'actioning' : 'audit');
    setSort(defaultSort);
    listRef.current.submit(defaultParams, defaultSort);
  };

  useEffect(() => {
    clear();
  }, [type, taskSkuId, createUser]);

  const processListRef = useRef();

  const [searchValue, setSearchValue] = useState('');

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
            setScreenDatas(defaultScreenDatas);
            submit({ queryType: 1 });
            break;
          case 'audited':
            setScreenDatas([{ title: '审批状态', key: 'status' }, ...defaultScreenDatas]);
            submit({ queryType: 2 });
            break;
          case 'send':
            setScreenDatas([{ title: '审批状态', key: 'status' }, ...defaultScreenDatas]);
            submit({ queryType: 3 });
            break;

          case 'actioning':
            setScreenDatas(defaultScreenDatas);
            submit({ status: '2' });
            break;
          case 'complete':
            setScreenDatas(defaultScreenDatas);
            submit({ status: '5' });
            break;
          case 'revoke':
            setScreenDatas(defaultScreenDatas);
            submit({ status: '6' });
            break;
          default:
            break;
        }
        setKey(key);
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
          screenDatas.map((item) => {
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
      noProgress={['audit', 'complete', 'audited'].includes(key)}
      manual
      ReceiptDom={ReceiptDom}
      listRef={listRef}
      processListRef={processListRef}
    />

    <TaskTypes
      zIndex={1001}
      value={params.type}
      visible={screenKey === 'type'}
      onClose={() => setScreenkey('')}
      onChange={({ key, title }) => {
        const newScreenDatas = screenDatas.filter(item => !['pickUserId', 'customerId'].includes(item.key));
        switch (key) {
          case ReceiptsEnums.outstockOrder:
            setScreenDatas([...newScreenDatas, { title: '领料人', key: 'pickUserId' }]);
            break;
          case ReceiptsEnums.instockOrder:
            setScreenDatas([...newScreenDatas, { title: '供应商', key: 'customerId' }]);
            break;
          default:
            setScreenDatas(newScreenDatas);
            break;
        }
        submit({ type: key });
        setScreen({ ...screen, typeName: key ? title : '' });
        setScreenkey('');
      }}
    />

    <Customers
      onClose={() => setScreenkey('')}
      zIndex={1001}
      value={params.customerId}
      visible={screenKey === 'customerId'}
      onChange={(customer) => {
        submit({ customerId: customer?.value });
        setScreen({ ...screen, customerName: customer?.label });
        setScreenkey('');
      }}
    />

    <CheckUser
      zIndex={1001}
      ref={createUserRef}
      onClose={() => setScreenkey('')}
      value={params.createUser ? [{ id: params.createUser }] : []}
      onChange={(users) => {
        submit({ createUser: isObject(users[0]).id });
        setScreen({ ...screen, createUserName: isObject(users[0]).name });
        setScreenkey('');
      }}
    />

    <CheckUser
      zIndex={1001}
      ref={userRef}
      onClose={() => setScreenkey('')}
      value={params.pickUserId ? [{ id: params.pickUserId }] : []}
      onChange={(users) => {
        submit({ pickUserId: isObject(users[0]).id });
        setScreen({ ...screen, userName: isObject(users[0]).name });
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
      dataRef={dataRef}
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
        { label: '审批通过', value: '3' },
        { label: '审批驳回', value: '4' },
        { label: '已完成', value: '5' },
        { label: '任务撤回', value: '6' },
      ]}
      onClose={() => setScreenkey('')}
      onChange={(option) => {
        submit({ status: (option?.value && option?.value !== 'all') && option.value });
        setScreen({ ...screen, statusName: option.label });
        setScreenkey('');
      }}
    />

  </>;
};

export default React.forwardRef(MyAudit);
