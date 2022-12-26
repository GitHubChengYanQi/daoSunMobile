import React, { useState } from 'react';
import styles from './index.less';
import moment from 'moment/moment';
import { useRequest } from '@/util/Request';
import { classNames, isArray } from '@/pages/components/ToolUtil';
import { MyLoading } from '@/pages/components/MyLoading';
import ScreenButtons from '@/pages/Report/InStockReport/components/ScreenButtons';
import { Divider } from 'antd-mobile';



export const outStockOrderView = {

  data: {},
  // data: { beginTime: defaultTime[0], endTime: defaultTime[1] },
};


const  CountStatistics = () => {


  const [status, setStatus] = useState([]);

  const [types, setTypes] = useState([]);

  const { loading: inLoading, data, run: inRun } = useRequest(outStockOrderView, {
    onSuccess: (res) => {

      let ok = 0;
      let error = 0;
      isArray(res.orderCountByStatus).forEach(item => {
        switch (item.status) {
          case 0:
            ok += item.orderCount;
            break;
          case 50:
          case 99:
            error += item.orderCount;
            break;
        }
      });
      const total = ok + error;
      setStatus([
        { number: ok, num:10, color: '#257BDE', text: '正常' },
        { number: error, num:  90, color: '#FA8F2B', text: '异常' },
      ]);

      let type1 = 0;
      let type2 = 0;
      let type3 = 0;
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
        }
      });
      // Math.round((type1 / typeTotal) * 100) || 0,
      const typeTotal = type1 + type2 + type3 ;
      setTypes([
        { number: type1, num: 20, color: '#257BDE', text: '明盘' },
        { number: type2, num:30, color: '#82B3EA', text: '暗盘' },
        { number: type3, num: 50, color: '#FA8F2B', text: '即时盘点', },
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
      <div className={styles.title}>盘点次数统计</div>
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
            {item.text}&nbsp;&nbsp;{item.number}({item.num}%)
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
            {item.text}&nbsp;&nbsp;{item.number}({item.num}%)
          </div>;
        })}
      </div>
    </div>
    <div style={{ height: 8 }} />
  </div>;
};

export default CountStatistics;
