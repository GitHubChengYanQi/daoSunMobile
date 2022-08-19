import React, { useEffect, useState } from 'react';
import { Button, Tabs } from 'antd-mobile';
import style from './index.less';
import MySearch from '../../../components/MySearch';
import { ReceiptsEnums } from '../../../Receipts';
import MyAudit from '../../ProcessTask/MyAudit';
import { useLocation } from 'umi';
import MyNavBar from '../../../components/MyNavBar';
import { useHistory } from 'react-router-dom';
import TaskBottom from './components/TaskBottom';
import KeepAlive from '../../../../components/KeepAlive';

export const processTask = { url: '/activitiProcessTask/auditList', method: 'POST' };


export const TaskList = (
  {
    activeKey,
    keyChange = () => {
    },
  },
) => {

  const { query } = useLocation();

  const history = useHistory();

  const [key, setKey] = useState(query.type || activeKey || ReceiptsEnums.instockOrder);

  useEffect(() => {
    if (query.type){
      setKey(query.type);
    }
  }, [query.type]);

  const [scrollTop, setScrollTop] = useState(0);

  const tabs = [
    { title: '调拨任务', key: ReceiptsEnums.allocation },
    { title: '出库任务', key: ReceiptsEnums.outstockOrder },
    { title: '入库任务', key: ReceiptsEnums.instockOrder },
    { title: '养护任务', key: ReceiptsEnums.maintenance },
    { title: '盘点任务', key: ReceiptsEnums.stocktaking },
  ];

  const extraIcon = () => {
    switch (key) {
      case ReceiptsEnums.stocktaking:
        return <Button fill='outline' color='primary' onClick={() => {
          history.push('/Work/Inventory/RealTimeInventory');
        }}>
          即时盘点
        </Button>;
      default:
        return null;
    }
  };

  return <div
    id='taskList'
    style={query.type ? {
      scrollMarginTop: scrollTop,
      height: '100%',
      overflow: 'auto',
    } : {}}
    onScroll={(event) => {
      setScrollTop(event.target.scrollTop);
    }}>
    {query.type && <MyNavBar title='任务列表' />}
    <MySearch
      placeholder='请输入单据相关信息'
      extraIcon={extraIcon()}
    />
    <div hidden={activeKey}>
      <Tabs activeKey={key} onChange={(key) => {
        setKey(key);
        keyChange(key);
      }} className={style.tab}>
        {
          tabs.map((item) => {
            return <Tabs.Tab {...item} />;
          })
        }
      </Tabs>
    </div>

    <MyAudit
      listScreentTop={!query.type && 0}
      auditType='audit'
      type={key}
      paramsChange={(param = {}) => {
        const types = param.types || [];
        setKey(types[0]);
      }}
    />


    {query.type && <TaskBottom taskKey={key} task />}

  </div>;
};

const Task = (
  {
    activeKey,
    keyChange = () => {
    },
  },
) => {
  return <KeepAlive id='task' contentId='taskList'>
    <TaskList keyChange={keyChange} activeKey={activeKey} />
  </KeepAlive>;
};

export default Task;
