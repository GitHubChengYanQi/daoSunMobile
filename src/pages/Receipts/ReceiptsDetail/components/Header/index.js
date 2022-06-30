import React from 'react';
import style from './index.less';
import { Avatar } from 'antd';
import { ReceiptsEnums } from '../../../index';
import { MyDate } from '../../../../components/MyDate';

const Header = ({ data = {} }) => {

  const receipts = data.receipts || {};

  const receiptsData = () => {
    switch (data.type) {
      case ReceiptsEnums.instockOrder:
      case ReceiptsEnums.instockError:
      case ReceiptsEnums.outstockOrder:
      case ReceiptsEnums.maintenance:
      case ReceiptsEnums.stocktaking:
        return {
          coding: receipts.coding,
          statusName: receipts.statusName,
        };
      default:
        return {};
    }
  };

  return <div className={style.header}>
    <Avatar className={style.avatar} size={60}>
      {data.createName && data.createName.substring(0, 1)}
    </Avatar>
    <div className={style.data}>
      <div className={style.line}>
        <div className={style.name}>
          {data.taskName}
        </div>
        <span>
          · {receiptsData().statusName}
        </span>
      </div>
      <div className={style.line}>
        <div>
          {receiptsData().coding}
        </div>
        <span className={style.time}>
          {MyDate.Show(data.createTime)}
        </span>
      </div>
    </div>
  </div>;
};

export default Header;
