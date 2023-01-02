import React, { useState } from 'react';
import { Button, Divider } from 'antd-mobile';
import { classNames, isArray } from '../../../../../util/ToolUtil';
import styles from '../../../InStockReport/index.less';
import moment from 'moment';
import { useRequest } from '../../../../../util/Request';
import { MyLoading } from '../../../../components/MyLoading';
import ScreenButtons from '../../../InStockReport/components/ScreenButtons';


const defaultTime = [
  moment().month(moment().month()).startOf('month').format('YYYY/MM/DD 00:00:00'),
  moment().month(moment().month()).endOf('month').format('YYYY/MM/DD 23:59:59'),
];
export const outStockOrderView = {
  url: '/statisticalView/outStockOrderView',
  method: 'POST',
  data: {},
  // data: { beginTime: defaultTime[0], endTime: defaultTime[1] },
};


const TaskStatistics = ({ title }) => {

  const [status, setStaus] = useState([]);

  const [types, setTypes] = useState([]);

  const [total, setTotal] = useState(0);

  const { loading: inLoading, data, run: inRun } = useRequest(outStockOrderView, {
    onSuccess: (res) => {

      let ok = 0;
      let ing = 0;
      let revoke = 0;
      isArray(res.orderCountByStatus).forEach(item => {
        switch (item.status) {
          case 0:
            ing += item.orderCount;
            break;
          case 49:
            revoke += item.orderCount;
            break;
          case 50:
          case 99:
            ok += item.orderCount;
            break;
        }
      });
      const total = ok + ing + revoke;
      setStaus([
        { number: ok, num: Math.round((ok / total) * 100) || 0, color: '#257BDE', text: '已完成' },
        { number: ing, num: Math.round((ing / total) * 100) || 0, color: '#FA8F2B', text: '执行中' },
        {
          number: revoke,
          num: total <= 0 ? 0 : 100 - (Math.round((ok / total) * 100) || 0) - (Math.round((ing / total) * 100) || 0),
          color: '#D8D8D8',
          text: '已撤销',
        },
      ]);
      setTotal(total);
      let type1 = 0;
      let type2 = 0;
      let type3 = 0;
      let type4 = 0;
      let type5 = 0;
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
          case 'LOSS_REPORTING':
            type5 += item.orderCount;
            break;
        }
      });
      const typeTotal = type1 + type2 + type3 + type4 + type5;
      setTypes([
        { number: type1, num: Math.round((type1 / typeTotal) * 100) || 0, color: '#257BDE', text: '生产任务' },
        { number: type2, num: Math.round((type2 / typeTotal) * 100) || 0, color: '#2EAF5D', text: '三包服务' },
        { number: type3, num: Math.round((type3 / typeTotal) * 100) || 0, color: '#FA8F2B', text: '备品配件' },
        { number: type4, num: Math.round((type4 / typeTotal) * 100) || 0, color: '#FF3131', text: '生产损耗' },
        {
          number: type5,
          num: typeTotal <= 0 ? 0 : 100 - (Math.round((type1 / typeTotal) * 100) || 0) - (Math.round((type2 / typeTotal) * 100) || 0) - (Math.round((type3 / typeTotal) * 100) || 0) - (Math.round((type4 / typeTotal) * 100) || 0),
          color: '#FF3131',
          text: '报损出库',
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
      <div className={styles.title}>{title}</div>
    </div>
    <div className={classNames(styles.dateTotal, styles.flexCenter)}>
      <ScreenButtons onChange={(value) => {
        inRun({ data: { beginTime: value[0], endTime: value[1] } });
      }} />
      <div className={styles.action}>
        总计 <span className='numberBlue'>{total}</span>
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
      <div className={styles.flexCenter}
           style={{ columnGap: 50, rowGap: 8, flexWrap: 'wrap', fontSize: 12, paddingTop: 8 }}>
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
      <div className={styles.flexCenter}
           style={{ columnGap: 50, rowGap: 8, flexWrap: 'wrap', fontSize: 12, paddingTop: 8 }}>
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
