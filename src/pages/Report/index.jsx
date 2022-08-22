import React, { useState } from 'react';
import MyCard from '../components/MyCard';
import LinkButton from '../components/LinkButton';
import ReportSwiper from './components/ReportSwiper';
import Order from './components/Order';
import style from './index.less';
import TaskList from './components/TaskList';
import { useHistory } from 'react-router-dom';

const Report = () => {

  const history = useHistory();

  const [title, setTitle] = useState();

  return <div className={style.report}>
    <MyCard title={title} extra={<LinkButton onClick={() => {
      history.push('/Report/StatisticalChart');
    }}>更多</LinkButton>}>
      <ReportSwiper titleChange={setTitle} />
    </MyCard>

    <MyCard title='单据记录' bodyClassName={style.bodyClassName}>
      <Order />
    </MyCard>

    <MyCard title='任务记录' extra={<LinkButton onClick={() => {
      history.push('/Work/ProcessTask');
    }}>更多</LinkButton>}>
      <TaskList />
    </MyCard>

  </div>;
};

export default Report;
