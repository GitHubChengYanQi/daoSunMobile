import React from 'react';
import style from './index.less';
import { RightOutline } from 'antd-mobile-icons';
import { MyDate } from '../../../../../components/MyDate';
import { Progress } from 'antd';
import Icon from '../../../../../components/Icon';

const TaskItem = (
  {
    taskName,
    createTime,
    beginTime,
    endTime,
    coding,
    positionSize = 0,
    skuSize = 0,
    onClick = () => {
    },
    index,
    otherData,
    orderData,
    percent = 0,
    noBorder,
    noSku,
    noPosition,
    noProgress,
  },
) => {

  const getHour = (begin, end) => {
    const dateDiff = MyDate.formatDate(begin).getTime() - MyDate.formatDate(end).getTime();
    return Number((dateDiff / 3600000).toFixed(2));
  };

  const totalHour = getHour(endTime, beginTime);
  const total = totalHour + (totalHour * 0.1);
  const pastTimes = getHour(new Date(), beginTime);
  const overtime = getHour(new Date(), endTime);
  const pastTimesPercent = overtime > 0 ? 95 : ((pastTimes > 0 && total > 0) ? parseInt((pastTimes / total) * 100) : 0);

  return <div key={index} className={style.orderItem} style={{ padding: 0 }} onClick={onClick}>
    <div className={style.data} hidden={!taskName}>
      <div className={style.taskData}>
        <div className={style.name}>
          <span className={style.title}>{taskName} {coding && '/'}{coding}</span>
          <RightOutline style={{ color: '#B9B9B9' }} />
        </div>
      </div>
      <div className={style.status} style={{ color: '#555555', width: 130, textAlign: 'right' }}>
        {MyDate.Show(createTime)}
      </div>
    </div>
    <div className={style.content}>
      <div className={style.orderData}>
        <div hidden={noSku} className={style.dateShow}>
          <div className={style.show} style={{ border: noBorder && 'none' }}>
            <Icon type='icon-pandianwuliao' />
            <div className={style.showNumber}>
              <span className={style.number}>{skuSize}</span>
              <span>涉及物料</span>
            </div>
          </div>
          <div hidden={noPosition} className={style.show} style={{ borderLeft: 'none', border: noBorder && 'none' }}>
            <Icon type='icon-pandiankuwei' />
            <div className={style.showNumber}>
              <span className={style.number}>{positionSize}</span>
              <span>涉及库位</span>
            </div>
          </div>

        </div>
        {orderData}
        <div className={style.progress} hidden={noProgress}>
          <Progress
            strokeColor='var(--adm-color-primary)'
            format={(number) => {
              return <span className={style.blue}>{number + '%'}</span>;
            }}
            percent={percent}
          />
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
