import React from 'react';
import style from './index.less';
import { MyDate } from '../../../../../components/MyDate';
import Icon from '../../../../../components/Icon';
import { classNames, isArray, isObject, timeDifference, ToolUtil, viewWidth } from '../../../../../../util/ToolUtil';
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
};

export default TaskItem;
