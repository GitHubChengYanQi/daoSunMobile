import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'antd-mobile';
import { ReceiptsEnums } from '../../../Receipts';
import MyAudit from '../../ProcessTask/MyAudit';
import { useLocation } from 'umi';
import MyNavBar from '../../../components/MyNavBar';
import { useHistory } from 'react-router-dom';
import TaskBottom from './components/TaskBottom';
import KeepAlive from '../../../../components/KeepAlive';

export const processTask = { url: '/activitiProcessTask/auditList', method: 'POST' };

export const TaskList = ({ stock }) => {

  const { query } = useLocation();

  const [type, setType] = useState();

  useEffect(() => {
    if (stock) {
      setType('');
    } else if (query.type) {
      setType(query.type);
    }
  }, [query.type, stock]);

  const history = useHistory();

  const ref = useRef();

  const [scrollTop, setScrollTop] = useState(0);

  const extraIcon = () => {
    switch (type) {
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
    style={type ? {
      scrollMarginTop: scrollTop,
      height: '100%',
      overflow: 'auto',
    } : {}}
    onScroll={(event) => {
      setScrollTop(event.target.scrollTop);
    }}>
    {type && <MyNavBar title='任务列表' />}

    <MyAudit
      extraIcon={extraIcon()}
      task
      ref={ref}
      type={type}
    />

    {type && <TaskBottom taskKey={type} task />}

  </div>;
};

const Task = (
  {
    stock,
  },
) => {
  return <KeepAlive id='task' contentId='taskList'>
    <TaskList stock={stock} />
  </KeepAlive>;
};

export default Task;
