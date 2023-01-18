import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'antd-mobile';
import { ReceiptsEnums } from '../../../Receipts';
import MyAudit from '../../ProcessTask/MyAudit';
import { useLocation } from 'umi';
import MyNavBar from '../../../components/MyNavBar';
import { useHistory } from 'react-router-dom';
import TaskBottom from './components/TaskBottom';

export const processTask = { url: '/activitiProcessTask/auditList', method: 'POST' };

const Task = (
  {
    stock,
  },
) => {

  const { query } = useLocation();

  const history = useHistory();

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
      type={query.type}
    />

    {query.type && <TaskBottom taskKey={query.type} task />}

  </div>;
};

export default Task;
