import React, { useState } from 'react';
import MyNavBar from '../../components/MyNavBar';
import MyCard from '../../components/MyCard';
import { Space } from 'antd-mobile';
import MyList from '../../components/MyList';
import { MyDate } from '../../components/MyDate';
import style from '../StatisticalChart/index.less';
import { ToolUtil } from '../../components/ToolUtil';
import { RightOutline } from 'antd-mobile-icons';
import TaskStatisicalChart from '../components/TaskStatisicalChart';

const TaskData = () => {

  const tabs = [
    { title: '入库' },
    { title: '出库' },
    { title: '盘点' },
    { title: '养护' },
    { title: '调拨' },
  ];

  const [data, setData] = useState([1, 2]);

  return <>
    <MyNavBar title='任务统计' />
    <MyCard title='分析图表'>
      <TaskStatisicalChart />
    </MyCard>
    <MyCard title='任务明细'>
      <MyList data={data}>
        {
          data.map((item, index) => {
            return <div key={index} className={ToolUtil.classNames(style.flexCenter, style.orderItem)}>
              <div className={style.row}>xxx的记录单 / 113213</div>
              <div className={style.time}><Space>{MyDate.Show(new Date())}<RightOutline /></Space></div>
            </div>;
          })
        }
      </MyList>
    </MyCard>
  </>;
};

export default TaskData;
