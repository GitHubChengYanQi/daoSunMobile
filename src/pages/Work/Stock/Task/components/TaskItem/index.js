import React from 'react';
import style from './index.less';
import { MyDate } from '../../../../../components/MyDate';
import Icon from '../../../../../components/Icon';
import { classNames, isArray, isObject, timeDifference, ToolUtil, viewWidth } from '../../../../../components/ToolUtil';
import MyProgress from '../../../../../components/MyProgress';
import SkuItem from '../../../../Sku/SkuItem';
import ShopNumber from '../../../../AddShop/components/ShopNumber';
import MyEllipsis from '../../../../../components/MyEllipsis';
import MyCard from '../../../../../components/MyCard';
import { Avatar } from 'antd';
import { Space } from 'antd-mobile';

const TaskItem = (
  {
    taskName,
    createTime,
    beginTime,
    endTime,
    coding,
    onClick = () => {
    },
    index,
    percent = 0,
    noSku,
    noPosition,
    noProgress,
    processRender,
    statusName,
    action = true,
    users = [],
    userLabel,
    otherData,
    task = {},
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

  let color;

  switch (task.status) {
    case 49:
      color = '#9a9a9a';
      break;
    case 50:
      color = 'var(--adm-color-danger)';
      break;
    case 99:
      color = '#599745';
      break;
    default:
      color = action ? 'var(--adm-color-primary)' : '#9a9a9a';
      break;
  }

  return <>
    <MyCard
      onClick={onClick}
      className={style.card}
      titleBom={
        <div className={style.header}>
          <div className={style.title}>{taskName}</div>
          <div style={{ border: `solid 1px ${color}`, color }} className={style.status}>
            {statusName}
          </div>
        </div>
      }
      extraClassName={style.extra}
      extra={timeDifference(createTime)}
      bodyClassName={style.body}
    >
      <div hidden={!task.theme} className={style.theme}>{task.theme}</div>
      <div className={style.user}>
        {userLabel || '执行人'}：
        {isArray(users).length === 0 && '无'}
        {
          isArray(users).filter((item, index) => index < 3).map((item, index) => {
            return <span
              className={style.userItem}
              key={index}
            >
              <Avatar
                size={18}
                key={index}
                style={{ marginRight: 4 }}
                src={item.avatar || ''}
              >
                  {item.name ? item?.name.substring(0, 1) : ''}
                </Avatar>
              {item.name}
            </span>;
          })
        }
        {isArray(users).length > 3 && '...'}
      </div>
      <div hidden={!otherData} className={style.otherData}>
        <MyEllipsis width='100%'>{otherData}</MyEllipsis>
      </div>
      <div className={style.process} hidden={noProgress}>
        {processRender || <MyProgress percent={percent} />}
      </div>
    </MyCard>
    <div className={style.space} />
  </>;

  return <div key={index} className={style.orderItem} style={{ padding: 0 }} onClick={onClick}>
    <div className={style.title}>
      {taskName} {coding && '/'} {coding}
    </div>
    <div className={style.content}>
      <div className={style.orderData}>
        <div hidden={noSku} className={style.dateShow}>
          <div className={style.svg}>
            <img src={img} alt='' height={26} width={70} />
          </div>
          <div hidden={!statusName} className={style.statusName}>
            <div>{statusName}</div>
          </div>
          <div className={style.show}>
            <Icon type='icon-pandianwuliao' />
            <div className={style.showNumber}>
              <span>涉及  <span className={style.number}>{skuSize}</span> 类物料</span>
            </div>
          </div>
          <div hidden={noPosition} className={style.show}>
            <Icon type='icon-pandiankuwei1' />
            <div className={style.showNumber}>
              <span>涉及 <span className={style.number}>{positionSize}</span> 个库位</span>
            </div>
          </div>
        </div>
        <div className={style.taskContent} hidden={skus.length === 0}>
          <div className={style.skus}>
            {
              ToolUtil.isArray(skus).map((item, index) => {
                return <div key={index} className={style.skuItem}>
                  <SkuItem
                    noView
                    extraWidth='120px'
                    className={style.sku}
                    imgSize={24}
                    hiddenNumber
                    oneRow
                    skuResult={item.skuResult || item}
                  />
                  <ShopNumber show value={item.number || 0} />
                </div>;
              })
            }
          </div>
          <div
            id='scale'
            hidden={!beginTime}
            className={style.timeBar}
          >
            {
              scaleItems.map((item, index) => {
                return <div
                  key={index}
                  className={ToolUtil.classNames(style.scale, index < overScale && style.over)} />;
              })
            }
          </div>
        </div>
        <div className={style.progress} style={{ border: skus.length === 0 && 'none' }}>
          <div className={style.origin} hidden={!originRet}>
            <span className='blue'>来源</span> <Icon type='icon-laiyuan' /> {originRet?.title} / {originRet?.coding}
          </div>
          <MyProgress hidden={noProgress} percent={percent} />
        </div>
        <div className={style.taskData}>
          <div className={style.user}>
            <MyEllipsis maxWidth={viewWidth() / 2}>{userLabel || '执行人'}：{users}</MyEllipsis>
          </div>
          <div className={style.status} style={{ color: '#808080', width: 130, textAlign: 'right' }}>
            {MyDate.Show(createTime)}
          </div>
        </div>
      </div>
    </div>

  </div>;
};

export default TaskItem;
