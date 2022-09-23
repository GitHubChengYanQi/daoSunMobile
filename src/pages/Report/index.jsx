import React, { useEffect, useState } from 'react';
import MyCard from '../components/MyCard';
import LinkButton from '../components/LinkButton';
import ReportSwiper from './components/ReportSwiper';
import Order from './components/Order';
import style from './index.less';
import TaskList from './components/TaskList';
import { useHistory } from 'react-router-dom';
import MyNavBar from '../components/MyNavBar';

const Report = () => {

  const history = useHistory();

  const [title, setTitle] = useState();

  return <div className={style.report}>
    <MyNavBar title='数据' noDom />
    <MyCard title={title} extra={<LinkButton onClick={() => {
      history.push('/Report/StatisticalChart');
    }}>更多</LinkButton>}>
      <ReportSwiper titleChange={setTitle} />
    </MyCard>

    <MyCard
      title='单据'
      headerClassName={style.orderHeader}
      className={style.orderCard}
      bodyClassName={style.orderBody}
    >
      <Order />
    </MyCard>

    <MyCard
      bodyClassName={style.taskBody}
      title='任务'
    >
      <TaskList />
    </MyCard>

  </div>;
};

export default Report;
