import React, { useState } from 'react';
import { Button, Divider } from 'antd-mobile';
import { classNames } from '../../../../components/ToolUtil';
import styles from '../../../InStockReport/index.less';

const TaskStatistics = () => {

  const [timeType, setTimeType] = useState();

  // {text:'类型', type:'ORDER_TYPE'},
  // {text:'状态', type:'ORDER_STATUS'}

  const status = [
    { num: 92, color: '#257BDE', text: '已完成' },
    { num: 3, color: '#FA8F2B', text: '执行中' },
    { num: 5, color: '#D8D8D8', text: '已撤销' },
  ];

  const types = [
    { num: 80, color: '#257BDE', text: '生产任务' },
    { num: 3, color: '#82B3EA', text: '三包服务' },
    { num: 5, color: '#2EAF5D', text: '备品配件' },
    { num: 2, color: '#FA8F2B', text: '生产损耗' },
    { num: 10, color: '#FF3131', text: '报损出库' },
  ];

  return <div className={styles.card}>
    <div className={styles.header}>
      <div className={styles.title}>任务统计</div>
    </div>
    <div className={classNames(styles.dateTotal, styles.flexCenter)}>
      <div className={classNames(styles.screen, styles.flexGrow)}>
        <Button
          className={styles.leftButton}
          color='primary'
          fill={timeType === 'day' ? '' : 'outline'}
          onClick={() => setTimeType('day')}
        >
          今天
        </Button>
        <Button
          color='primary'
          fill={timeType === 'week' ? '' : 'outline'}
          onClick={() => setTimeType('week')}
        >
          本周
        </Button>
        <Button
          color='primary'
          fill={timeType === 'month' ? '' : 'outline'}
          onClick={() => setTimeType('month')}
        >
          本月
        </Button>
        <Button
          className={styles.rightButton}
          color='primary'
          fill={timeType === 'diy' ? '' : 'outline'}
          onClick={() => setTimeType('diy')}
        >
          自定义
        </Button>
      </div>
      <div>
        总计 <span style={{ fontSize: 18 }} className='numberBlue'>160</span>
      </div>
    </div>

    <div className={styles.taskStatisticsContent}>
      <Divider style={{ margin: '8px 0', width: 100 }}>状态</Divider>
      <div>
        {status.map((item, index) => {
          return <div
            key={index}
            className={styles.progress}
            style={{ backgroundColor: item.color, width: `${item.num}%` }}
          />;
        })}
      </div>
      <div className={styles.flexCenter} style={{ columnGap: 50, rowGap: 8, flexWrap: 'wrap', fontSize: 12 }}>
        {status.map((item, index) => {
          return <div
            className={styles.flexCenter}
            key={index}
          >
            <div style={{ backgroundColor: item.color }} className={styles.circle} />
            {item.text}
          </div>;
        })}
      </div>
    </div>

    <div className={styles.taskStatisticsContent}>
      <Divider style={{ margin: '8px 0', width: 100 }}>类型</Divider>
      <div>
        {types.map((item, index) => {
          return <div
            key={index}
            className={styles.progress}
            style={{ backgroundColor: item.color, width: `${item.num}%` }}
          />;
        })}
      </div>
      <div className={styles.flexCenter} style={{ columnGap: 50, rowGap: 8, flexWrap: 'wrap', fontSize: 12 }}>
        {types.map((item, index) => {
          return <div
            key={index}
            className={styles.flexCenter}
          >
            <div style={{ backgroundColor: item.color }} className={styles.circle} />
            {item.text}&nbsp;&nbsp;123({item.num}%)
          </div>;
        })}
      </div>
    </div>
    <div style={{ height: 8 }} />
  </div>;
};

export default TaskStatistics;
