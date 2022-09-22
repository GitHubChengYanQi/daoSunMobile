import React from 'react';
import style from './index.less';
import { MyDate } from '../../../../../components/MyDate';
import Icon from '../../../../../components/Icon';
import { isArray, isObject, ToolUtil } from '../../../../../components/ToolUtil';
import MyProgress from '../../../../../components/MyProgress';
import SkuItem from '../../../../Sku/SkuItem';
import ShopNumber from '../../../../AddShop/components/ShopNumber';
import receiptsOk from '../../../../../../assets/receiptsTask-ok.png';
import receiptsNo from '../../../../../../assets/receiptsTask-no.png';

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
    skus = [],
    index,
    percent = 0,
    noSku,
    noPosition,
    noProgress,
    statusName,
    action,
    users,
    userLabel,
    origin = {},
  },
) => {
  const originRet = isArray(origin?.parent)[0]?.ret;
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
          <div className={style.svg}>
            <img src={action ? receiptsOk : receiptsNo} alt='' height={24} />
          </div>
          <div hidden={!statusName} className={style.statusName}>
            <div style={{ zIndex: 1 }}>{statusName}</div>
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
