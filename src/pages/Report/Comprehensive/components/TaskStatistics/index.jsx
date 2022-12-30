import React, { useState } from 'react';
import { Button, Divider } from 'antd-mobile';
import { classNames, isArray } from '../../../../../util/ToolUtil';
import styles from '../../../InStockReport/index.less';
import { useRequest } from '../../../../../util/Request';
import { inStockOrderView } from '../../../InStockReport/components/TaskStatistics';
import moment from 'moment';
import ScreenButtons from '../../../InStockReport/components/ScreenButtons';
import { MyLoading } from '../../../../components/MyLoading';

const defaultTime = [
  moment().month(moment().month()).startOf('month').format('YYYY/MM/DD 00:00:00'),
  moment().month(moment().month()).endOf('month').format('YYYY/MM/DD 23:59:59'),
];
export const taskNumberView = {
  url: '/statisticalView/taskNumberView',
  method: 'POST',
  data: {},
  // data: { beginTime: defaultTime[0], endTime: defaultTime[1] },
};

const TaskStatistics = ({ title }) => {

  const [timeType, setTimeType] = useState();

  const [status, setStaus] = useState([]);

  const [types, setTypes] = useState([]);

  const [total, setTotal] = useState(0);

  const { loading, data, run } = useRequest(taskNumberView, {
    onSuccess: (res) => {
      let ok = 0;
      let ing = 0;
      let revoke = 0;
      let out = 0;
      isArray(res.taskNumberView.data).forEach(item => {
        switch (item.status) {
          case 0:
            ing += item.number;
            break;
          case 49:
            revoke += item.number;
            break;
          case 50:
          case 99:
            ok += item.number;
            break;
          case 100:
            // out
            break;
        }
      });
      const total = ok + ing + revoke + out;
      setStaus([
        { number: ok, num: Math.round((ok / total) * 100) || 0, color: '#257BDE', text: '已完成' },
        { number: ing, num: Math.round((ing / total) * 100) || 0, color: '#FA8F2B', text: '执行中' },
        {
          number: revoke,
          num: Math.round((revoke / total) * 100) || 0,
          color: '#D8D8D8',
          text: '已撤销',
        }, {
          number: out,
          num: 100 - (Math.round((ok / total) * 100) || 0) - (Math.round((ing / total) * 100) || 0) - (Math.round((revoke / total) * 100) || 0),
          color: '#FF3131',
          text: '已超期',
        },
      ]);
      setTotal(total);

      let type1 = 0;
      let type2 = 0;
      let type3 = 0;
      let type4 = 0;
      let type5 = 0;
      isArray(res.taskTypeView.data).forEach(item => {
        switch (item.type) {
          case 'INSTOCK':
            type1 += item.number;
            break;
          case 'OUTSTOCK':
            type2 += item.number;
            break;
          case 'Stocktaking':
            type3 += item.number;
            break;
          case 'MAINTENANCE':
            type4 += item.number;
            break;
          case 'ALLOCATION':
            type5 += item.number;
            break;
        }
      });
      const typeTotal = type1 + type2 + type3 + type4 + type5;

      setTypes([
        { number: type1, num: Math.round((type1 / typeTotal) * 100) || 0, color: '#257BDE', text: '入库' },
        { number: type2, num: Math.round((type2 / typeTotal) * 100) || 0, color: '#82B3EA', text: '出库' },
        { number: type3, num: Math.round((type3 / typeTotal) * 100) || 0, color: '#2EAF5D', text: '盘点' },
        {
          number: type4,
          num: Math.round((type4 / typeTotal) * 100) || 0,
          color: '#FA8F2B',
          text: '养护',
        }, {
          number: type5,
          num: 100 - (Math.round((type1 / typeTotal) * 100) || 0) - (Math.round((type2 / typeTotal) * 100) || 0) - (Math.round((type3 / typeTotal) * 100) || 0) - (Math.round((type4 / typeTotal) * 100) || 0),
          color: '#FF3131',
          text: '调拨',
        },
      ]);
    },
  });

  if (!data) {
    if (loading) {
      return <MyLoading skeleton />;
    }
  }

  return <div className={styles.card}>
    <div className={styles.header}>
      <div className={styles.title}>{title}</div>
    </div>
    <div className={classNames(styles.dateTotal, styles.flexCenter)}>
      <ScreenButtons onChange={(value) => {
        run({ data: { beginTime: value[0], endTime: value[1] } });
      }} />
      <div>
        总计 <span style={{ fontSize: 18 }} className='numberBlue'>{total}</span>
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
           style={{ columnGap: 24, rowGap: 8, flexWrap: 'wrap', fontSize: 12, paddingTop: 8 }}
      >
        {status.map((item, index) => {
          return <div
            className={styles.flexCenter}
            key={index}
          >
            <div style={{ backgroundColor: item.color }} className={styles.circle} />
            {item.text}&nbsp;&nbsp;{item.number} ({item.num}%)
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
           style={{ columnGap: 24, rowGap: 8, flexWrap: 'wrap', fontSize: 12, paddingTop: 8 }}
      >
        {types.map((item, index) => {
          return <div
            key={index}
            className={styles.flexCenter}
          >
            <div style={{ backgroundColor: item.color }} className={styles.circle} />
            {item.text}&nbsp;&nbsp;{item.number} ({item.num}%)
          </div>;
        })}
      </div>
    </div>
    <div style={{ height: 8 }} />

    {loading && <MyLoading />}
  </div>;
};

export default TaskStatistics;
