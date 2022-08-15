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
import { startList } from '../../Work/ProcessTask/ProcessList';
import { history } from 'umi';

const TaskData = () => {

  const [data, setData] = useState([]);

  return <>
    <MyNavBar title='任务统计' />
    <MyCard title='分析图表'>
      <TaskStatisicalChart />
    </MyCard>
    <MyCard title='任务明细'>
      <MyList api={startList} data={data} getData={setData}>
        {
          data.map((item, index) => {
            const receipts = item.receipts || {};
            const coding = receipts.coding;
            return <div
              key={index}
              className={ToolUtil.classNames(style.flexCenter, style.orderItem)}
              onClick={() => {
                history.push(`/Receipts/ReceiptsDetail?id=${item.processTaskId}`);
              }}
            >
              <div className={style.row}><span className={style.title}>{item.taskName}</span> <br /> {coding}</div>
              <div className={style.time}><Space>{MyDate.Show(item.createTime)}<RightOutline /></Space></div>
            </div>;
          })
        }
      </MyList>
    </MyCard>
  </>;
};

export default TaskData;