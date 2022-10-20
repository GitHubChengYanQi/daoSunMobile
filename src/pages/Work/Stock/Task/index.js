import React, { useEffect, useRef, useState } from 'react';
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


export const TaskList = () => {

  const { query } = useLocation();

  const history = useHistory();

  const ref = useRef();

  const [scrollTop, setScrollTop] = useState(0);

  const extraIcon = () => {
    switch (query.type) {
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

    <MyAudit
      extraIcon={extraIcon()}
      task
      ref={ref}
      type={query.type}
      paramsChange={(param = {}) => {
        const types = param.types || [];
      }}
    />

    {query.type && <TaskBottom taskKey={query.type} task />}

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
