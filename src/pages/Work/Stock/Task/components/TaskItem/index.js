import React from 'react';
import style from './index.less';
import { AppstoreOutline, RightOutline } from 'antd-mobile-icons';
import { MyDate } from '../../../../../components/MyDate';
import moment from 'moment';

const TaskItem = (
  {
    item,
    onClick = () => {
    },
    index,
  },
) => {
  const receipts = item.receipts || {};

  const getHour = (begin, end) => {
    const dateDiff = new Date(begin).getTime() - new Date(end).getTime();
    return Math.floor(dateDiff / 3600000);
  };

  console.log('当前时间 =>', moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
  console.log('开始时间 =>', receipts.beginTime);
  console.log('结束时间 =>', receipts.endTime);

  const totalHour = getHour(receipts.endTime, receipts.beginTime);
  console.log('总攻时间=>', totalHour);
  const pastTimes = getHour(new Date(), receipts.beginTime);
  console.log('过去时间=>', pastTimes);

  return <div key={index} className={style.orderItem} style={{ padding: 0 }} onClick={onClick}>
    <div className={style.data}>
      <div className={style.taskData}>
        <div className={style.name}>
          <span className={style.title}>{item.taskName} / {receipts.coding}</span>
          <RightOutline style={{ color: '#B9B9B9' }} />
        </div>
      </div>
      <div className={style.status} style={{ color: '#555555', width: 130, textAlign: 'right' }}>
        {MyDate.Show(item.createTime)}
        {/*{moment(item.beginTime).format('MM.DD')} — {moment(item.endTime).format('MM.DD')}*/}
      </div>
    </div>
    <div className={style.content}>
      <div className={style.orderData}>
        <div className={style.show}>
          <AppstoreOutline />
          <div className={style.showNumber}>
            <span className={style.number}>{receipts.positionSize}</span>
            <span>涉及库位</span>
          </div>
        </div>
        <div className={style.show} style={{ borderLeft: 'none' }}>
          <AppstoreOutline />
          <div className={style.showNumber}>
            <span className={style.number}>{receipts.skuSize}</span>
            <span>涉及物料</span>
          </div>
        </div>
      </div>

      <div
        className={style.timeBar}
        style={{
          background: `linear-gradient(to bottom,
          ${true ? `rgba(191, 192, 191, 0.7) ${0}%,` : ''}
           ${true ? `rgba(27, 231, 0, 0.7) ${40}%,` : ''}
            ${false ? `rgba(238, 183, 1, 0.7) ${0}%,` : ''}
             ${true ? `rgba(223, 0, 0, 0.7)) ${60}%` : ''}
           `,
        }}
      />
    </div>
  </div>;
};

export default TaskItem;
