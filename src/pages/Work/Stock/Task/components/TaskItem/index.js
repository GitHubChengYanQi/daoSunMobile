import React from 'react';
import style from './index.less';
import { AppstoreOutline, RightOutline } from 'antd-mobile-icons';
import { MyDate } from '../../../../../components/MyDate';

const TaskItem = (
  {
    taskName,
    createTime,
    beginTime,
    endTime,
    coding,
    positionSize,
    skuSize,
    onClick = () => {
    },
    index,
    otherData,
  },
) => {

  const getHour = (begin, end) => {
    const dateDiff = new Date(begin).getTime() - new Date(end).getTime();
    return Math.floor(dateDiff / 3600000);
  };


  const totalHour = getHour(endTime, beginTime);
  const total = totalHour + (totalHour * 0.1);
  const pastTimes = getHour(new Date(), beginTime);
  const pastTimesPercent = pastTimes > 0 ? parseInt((pastTimes / total) * 100) : 0;


  return <div key={index} className={style.orderItem} style={{ padding: 0 }} onClick={onClick}>
    <div className={style.data}>
      <div className={style.taskData}>
        <div className={style.name}>
          <span className={style.title}>{taskName} / {coding}</span>
          <RightOutline style={{ color: '#B9B9B9' }} />
        </div>
      </div>
      <div className={style.status} style={{ color: '#555555', width: 130, textAlign: 'right' }}>
        {MyDate.Show(createTime)}
      </div>
    </div>
    <div className={style.content}>
      <div className={style.orderData}>
        <div className={style.dateShow}>
          <div className={style.show}>
            <AppstoreOutline />
            <div className={style.showNumber}>
              <span className={style.number}>{positionSize}</span>
              <span>涉及库位</span>
            </div>
          </div>
          <div className={style.show} style={{ borderLeft: 'none' }}>
            <AppstoreOutline />
            <div className={style.showNumber}>
              <span className={style.number}>{skuSize}</span>
              <span>涉及物料</span>
            </div>
          </div>
        </div>
        {otherData}
      </div>

      <div
        hidden={!beginTime}
        className={style.timeBar}
        style={{
          background: `linear-gradient(to bottom,#35E11F 0%,#FFFC62 80%,#F72323 95%)`,
        }}
      >
        <div className={style.maks} style={{ height: `${pastTimesPercent > 95 ? 95 : pastTimesPercent}%` }} />
      </div>
    </div>
  </div>;
};

export default TaskItem;
