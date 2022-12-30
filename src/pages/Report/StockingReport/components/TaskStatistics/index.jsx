import React, { useState } from 'react';
import styles from '../CountStatistics/index.less';
import { useRequest } from '@/util/Request';
import { classNames, isArray } from '@/pages/components/ToolUtil';
import { MyLoading } from '@/pages/components/MyLoading';
import ScreenButtons from '@/pages/Report/InStockReport/components/ScreenButtons';
import { outStockOrderView } from '@/pages/Report/StockingReport/components/CountStatistics';


const TaskStatistics =()=>{

  const [timeType, setTimeType] = useState();

  const [status, setStatus] = useState([]);

  const [types, setTypes] = useState([]);

  const { loading: inLoading, data, run: inRun } = useRequest(outStockOrderView, {
    onSuccess: (res) => {

      let type1 = 0;
      let type2 = 0;
      let type3 = 0;
      let type4 = 0;
      isArray(res.orderCountByType).forEach(item => {
        switch (item.type) {
          case 'PRODUCTION_TASK':
            type1 += item.orderCount;
            break;
          case 'THREE_GUARANTEES':
            type2 += item.orderCount;
            break;
          case 'RESERVE_PICK':
            type3 += item.orderCount;
            break;
          case 'PRODUCTION_LOSS':
            type4 += item.orderCount;
            break;
        }
      });
      const typeTotal = type1 + type2 + type3+type4 ;
      setTypes([
        { number: type1, num: Math.round((type1 / typeTotal) * 100) || 0, color: '#257BDE', text: '已完成' },
        { number: type2, num: Math.round((type2 / typeTotal) * 100) || 0, color: '#FA8F2B', text: '执行中' },
        { number: type3, num: Math.round((type3 / typeTotal) * 100) || 0, color: '#D8D8D8', text: '已撤销' },
        {
          number: type4,
          num: 100 - (Math.round((type1 / typeTotal) * 100) || 0) - (Math.round((type2 / typeTotal) * 100)|| 0) - (Math.round((type3 / typeTotal) * 100) || 0),
          color: '#FF3131',
          text: '已超期',
        },
      ]);
    },
  });

  if (!data) {
    if (inLoading) {
      return <MyLoading skeleton />;
    }
  }

  return <div className={styles.card}>
    <div className={styles.header}>
      <div className={styles.title}>任务统计</div>
    </div>
    <div className={classNames(styles.dateTotal, styles.flexCenter)}>
      <ScreenButtons onChange={(value) => {
        inRun({ data: { beginTime: value[0], endTime: value[1] } });
      }} />
      <div>
        总计 <span style={{ fontSize: 18 }} className='numberBlue'>160</span>
      </div>
    </div>

    <div className={styles.taskStatisticsContent}>
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
            {item.text}&nbsp;&nbsp;{item.number}({item.num}%)
          </div>;
        })}
      </div>
    </div>
    <div style={{ height: 8 }} />
  </div>;
};

export default TaskStatistics;
