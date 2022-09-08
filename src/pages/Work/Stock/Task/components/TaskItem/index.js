import React from 'react';
import style from './index.less';
import { MyDate } from '../../../../../components/MyDate';
import Icon from '../../../../../components/Icon';
import { ToolUtil } from '../../../../../components/ToolUtil';
import MyProgress from '../../../../../components/MyProgress';
import SkuItem from '../../../../Sku/SkuItem';
import { SkuResultSkuJsons } from '../../../../../Scan/Sku/components/SkuResult_skuJsons';

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
    percent = 0,
    noSku,
    noPosition,
    noProgress,
    statusName,
    action,
    users,
    userLabel,
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
    <div className={style.title}>
      {taskName} {coding && '/'} {coding}
    </div>
    <div className={style.content}>
      <div className={style.orderData}>
        <div hidden={noSku} className={style.dateShow}>
          <div hidden={!statusName} className={ToolUtil.classNames(style.statusName, action && style.action)}>
            <div style={{zIndex:1}}>{statusName}</div>
            <div className={style.svg}><Icon type='icon-a-zu1' /></div>
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
        <div className={style.taskContent}>
          <div className={style.skus}>
            <SkuItem
              extraWidth='64px'
              className={style.sku}
              imgSize={24}
              hiddenNumber
              oneRow
              title={SkuResultSkuJsons({
                skuResult: {
                  specifications: '2*700mm黑色内螺',
                  skuName: '黑色内口冷却管',
                  spuResult: { name: ' lqg-700' },
                },
              })} />
            <SkuItem
              extraWidth='64px'
              className={style.sku}
              imgSize={24}
              hiddenNumber
              oneRow
              title={SkuResultSkuJsons({
                skuResult: {
                  specifications: '2*700mm黑色内螺',
                  skuName: '黑色内口冷却管',
                  spuResult: { name: ' lqg-700qweqweqweqweqw' },
                },
              })} />
          </div>
          <div
            id='scale'
            hidden={!beginTime}
            className={style.timeBar}
          >
            {
              scaleItems.map((item, index) => {
                return <div key={index}
                            className={ToolUtil.classNames(style.scale, index < overScale && style.over)} />;
              })
            }
          </div>
        </div>

        <div className={style.progress}>
          <MyProgress hidden={noProgress} percent={percent} />
        </div>
        <div className={style.taskData}>
          <div className={style.user}>
            {userLabel || '执行人'}：{users}
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
