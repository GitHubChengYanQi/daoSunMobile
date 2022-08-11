import React from 'react';
import style from '../Order/index.less';
import { MyDate } from '../../../components/MyDate';
import { RightOutline } from 'antd-mobile-icons';

const TaskList = () => {


  return <>
    {
      [1, 2, 3].map((item, index) => {
        return <div key={index} className={style.orderInfo}>
          <div className={style.orderName}>xxx的任务单</div>
          <div className={style.time}>{MyDate.Show(new Date())} <RightOutline /></div>
        </div>;
      })
    }
  </>
};

export default TaskList;
