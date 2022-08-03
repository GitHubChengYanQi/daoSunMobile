import React from 'react';
import style from './index.less';
import { RightOutline } from 'antd-mobile-icons';
import { MyDate } from '../../../../../components/MyDate';
import Icon from '../../../../../components/Icon';
import { ToolUtil } from '../../../../../components/ToolUtil';
import MyProgress from '../../../../../components/MyProgress';

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
    percent = 0,
    noSku,
    noPosition,
    noProgress,
    statusName,
    statusNameClassName,
    noBorder,
  },
) => {

  const scaleItems = Array(10).fill('');

  const getHour = (begin, end) => {
    const dateDiff = MyDate.formatDate(begin).getTime() - MyDate.formatDate(end).getTime();
    return Number((dateDiff / 3600000).toFixed(2));
  };

  const totalHour = getHour(endTime, beginTime);
  const total = totalHour + (totalHour * 0.1);
  const pastTimes = getHour(new Date(), beginTime);
  const overtime = getHour(new Date(), endTime);
  const pastTimesPercent = overtime > 0 ? 100 : ((pastTimes > 0 && total > 0) ? parseInt((pastTimes / total) * 100) : 0);
  const overScale = scaleItems.length * (pastTimesPercent / 100);

  return <div key={index} className={style.orderItem} style={{ padding: 0 }} onClick={onClick}>
    <div className={style.data} hidden={!taskName}>
      <div className={style.taskData}>
        <div className={style.name}>
          <span className={style.title}>{taskName} {coding && '/'}{coding}</span>
          <RightOutline style={{ color: '#B9B9B9' }} />
        </div>
      </div>
      <div className={style.status} style={{ color: '#808080', width: 130, textAlign: 'right' }}>
        {MyDate.Show(createTime)}
      </div>
    </div>
    <div className={style.content}>
      <div className={style.orderData}>
        <div hidden={noSku} className={style.dateShow} style={{ border: noBorder && 'none' }}>
          <div hidden={!statusName} className={ToolUtil.classNames(style.statusName, statusNameClassName)}>
            {statusName}
          </div>
          <div className={style.show}>
            <Icon type='icon-pandianwuliao' />
            <div className={style.showNumber}>
              <span>涉及  <span className={style.number}>{skuSize}</span> 类物料</span>
            </div>
          </div>
          <div hidden={noPosition} className={style.show} style={{ borderLeft: !noBorder && 'solid 1px #F5F5F5' }}>
            <Icon type='icon-pandiankuwei' />
            <div className={style.showNumber}>
              <span>涉及 <span className={style.number}>{positionSize}</span> 个库位</span>
            </div>
          </div>

        </div>
        {otherData}
      </div>

      <div
        id='scale'
        hidden={!beginTime}
        className={style.timeBar}
      >
        {
          scaleItems.map((item, index) => {
            return <div key={index} className={ToolUtil.classNames(style.scale, index < overScale && style.over)} />;
          })
        }
      </div>
    </div>

   <MyProgress hidden={noProgress} percent={percent} />
  </div>;
};

export default TaskItem;
