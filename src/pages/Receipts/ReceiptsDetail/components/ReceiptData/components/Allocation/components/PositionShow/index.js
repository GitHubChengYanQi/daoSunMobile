import style from '../../../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import Icon from '../../../../../../../../components/Icon';
import React from 'react';

export const PositionShow = (
  {
    outPositionName,
    inPositionName,
  }) => {

  return  <div className={style.skuPosition}>
    <div className={style.positionItem} hidden={!outPositionName}>{outPositionName}</div>
    <Icon type='icon-iconset0438' style={{ color: 'var(--adm-color-primary)' }} />
    <div className={style.positionItem} hidden={!inPositionName}>{inPositionName}</div>
  </div>
}
