import React from 'react';
import style from '../List/index.less';
import MyCheck from '../../../MyCheck';
import { isObject, ToolUtil } from '../../../ToolUtil';
import { MyDate } from '../../../MyDate';
import { UserName } from '../../../User';
import ShowCode from '../../../ShowCode';
import { ExclamationTriangleOutline } from 'antd-mobile-icons';

const InkindItem = (
  {
    positionItem = {},
    setInkinds = () => {
    },
    inkinds = [],
    inkindIds = [],
    noActions,
  },
) => {

  const inkindList = positionItem.inkindList || [];

  let number = 0;

  const checkInkinds = inkindList.filter(item => {
    number += item.number;
    return inkindIds.includes(item.inkindId);
  });

  const checked = checkInkinds.length === inkindList.length;

  return <div className={style.positionItem}>
    <div className={style.positionName} onClick={() => {
      const ids = inkindList.map(item => item.inkindId);
      const newInkinds = inkinds.filter(item => !ids.includes(item.inkindId));
      if (checked) {
        setInkinds(newInkinds);
      } else {
        setInkinds([...newInkinds, ...inkindList]);
      }
    }}>
      {!noActions && <MyCheck checked={checked} />}
      {positionItem.name} / {positionItem.storehouseName} ({number})
    </div>

    {
      inkindList.map((inkindItem, inkindIndex) => {
        const maintenanceLogResult = inkindItem.maintenanceLogResult || {};
        const checked = inkindIds.includes(inkindItem.inkindId);
        const qrCodeId = inkindItem.qrCodeId || '';
        return <div className={style.inkindItem} key={inkindIndex}>
          <div className={style.inkindData}>
            <div className={style.inkindId} onClick={() => {
              if (checked) {
                const newInkinds = inkinds.filter(item => item.inkindId !== inkindItem.inkindId);
                setInkinds(newInkinds);
              } else {
                setInkinds([...inkinds, inkindItem]);
              }
            }}>
              {!noActions && <MyCheck checked={checked} />}
              实物码：{qrCodeId.substring(qrCodeId.length - 6, qrCodeId.length)}
              <ShowCode size={20} code={inkindItem.inkindId} inkindId={inkindItem.inkindId} />
              <div>× {inkindItem.number}</div>
              {inkindItem.anomaly && <ExclamationTriangleOutline className='red' />}
            </div>

            <div className={style.brand}>
              {ToolUtil.isObject(inkindItem.brandResult).brandName || '无品牌'}
            </div>
          </div>
          <div className={style.otherData}>
            <div className={style.flex}>
              <div className={style.flexGrow}>
                入库时间：{MyDate.Show(inkindItem.createTime)}
              </div>
              <div>
                {isObject(inkindItem.user).name}
              </div>
            </div>
          </div>
          <div className={style.otherData} style={{paddingBottom:8}}>
            <div className={style.flex}>
              <div className={style.flexGrow}>
                上次养护：{maintenanceLogResult.createTime ? MyDate.Show(maintenanceLogResult.createTime) : '暂无'}
              </div>
              <div hidden={!maintenanceLogResult.createTime}>
                {isObject(maintenanceLogResult.userResult).name}
              </div>
            </div>
          </div>
        </div>;
      })
    }
  </div>;
};

export default InkindItem;
