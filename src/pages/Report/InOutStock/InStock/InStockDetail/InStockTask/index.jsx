import React, { useState } from 'react';
import MyNavBar from '../../../../../components/MyNavBar';
import MySearch from '../../../../../components/MySearch';
import MyCard from '../../../../../components/MyCard';
import StartEndDate from '../../../../../Work/Production/CreateTask/components/StartEndDate';
import LinkButton from '../../../../../components/LinkButton';
import { Space } from 'antd-mobile';
import moment from 'moment';
import { DownOutline, RightOutline } from 'antd-mobile-icons';
import style from '../index.less';
import MyFloatingBubble from '../../../../../components/FloatingBubble';
import Icon from '../../../../../components/Icon';
import TaskItem from '../../../../../Work/Stock/Task/components/TaskItem';

const InStockTask = () => {

  const [date, setDate] = useState([]);

  return <>
    <MyNavBar title='入库任务明细' />
    <MySearch placeholder='搜索' />
    <MyCard
      titleBom='辽宁辽工智能装备制造有限...'
      extra={<StartEndDate
        max={new Date()}
        value={date}
        onChange={setDate}
        render={date.length > 0 ?
          <LinkButton>
            <Space align='center'>
              {moment(date[0]).format('MM/DD') + ' - ' + moment(date[1]).format('MM/DD')}
              <DownOutline style={{ fontSize: 12 }} />
            </Space>
          </LinkButton>
          :
          <Space align='center' className={style.placeholder}>请选择时间范围 <DownOutline style={{ fontSize: 12 }} /></Space>}
      />}
    />
    <div className={style.total}>
      <div className={style.number}>
        <div>
          入库总数
          <span className='numberBlue'>216</span>类
          <span className='numberBlue'>10342</span>件
        </div>
        <div className={style.taskTotal}>
          <RightOutline style={{ fontSize: 12 }} />
        </div>
      </div>
    </div>

    {
      [1, 2].map((item, index) => {
        return <div key={index} className={style.skuItem}>
          <TaskItem />
        </div>;
      })
    }

    <MyFloatingBubble><Icon type='icon-download-2-fill' /></MyFloatingBubble>
  </>;
};

export default InStockTask;
