import React from 'react';
import style from '../List/index.less';
import MyCheck from '../../../MyCheck';
import { ToolUtil } from '../../../ToolUtil';
import { MyDate } from '../../../MyDate';
import { UserName } from '../../../User';
import ShowCode from '../../../ShowCode';

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

  const checkInkinds = inkindList.filter(item => inkindIds.includes(item.inkindId));

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
      {!noActions && <MyCheck checked={checked} />}{positionItem.name} / {positionItem.storehouseName}
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
              <ShowCode code={inkindItem.inkindId} />
              <div>× {inkindItem.number}</div>
            </div>

            <div className={style.brand}>
              {ToolUtil.isObject(inkindItem.brandResult).brandName || '无品牌'}
              {/*<LinkButton>更多</LinkButton>*/}
            </div>
          </div>
          <div className={style.otherData}>
            <div className={style.flex}>
              <div className={style.flexGrow}>
                入库时间：{MyDate.Show(inkindItem.createTime)}
              </div>
              <div>
                <UserName user={inkindItem.user} />
              </div>
            </div>
          </div>
          <div className={style.otherData}>
            <div className={style.flex}>
              <div className={style.flexGrow}>
                上次养护：{maintenanceLogResult.createTime ? MyDate.Show(maintenanceLogResult.createTime) : '暂无'}
              </div>
              <div hidden={!maintenanceLogResult.createTime}>
                <UserName user={maintenanceLogResult.userResult} />
              </div>
            </div>
          </div>
        </div>;
      })
    }
  </div>;
};

export default InkindItem;
