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
import LinkButton from '../../components/LinkButton';
import { useHistory } from 'react-router-dom';
import { useRequest } from '../../../util/Request';
import { MyLoading } from '../../components/MyLoading';

const TaskData = () => {

  const history = useHistory();

  const { loading, data } = useRequest({ ...startList, params: { limit: 10, page: 1 } });

  return <>
    <MyNavBar title='任务统计' />
    <MyCard title='分析图表'>
      <TaskStatisicalChart />
    </MyCard>
    <MyCard title='任务明细' extra={<LinkButton onClick={() => history.push('/Work/ProcessTask')}>更多</LinkButton>}>

      {loading && <MyLoading skeleton />}
      {
        ToolUtil.isArray(data).map((item, index) => {
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
    </MyCard>
  </>;
};

export default TaskData;
