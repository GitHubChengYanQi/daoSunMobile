import React from 'react';
import style from './index.less';
import { Avatar } from 'antd';
import { ReceiptsEnums } from '../../../index';
import { MyDate } from '../../../../components/MyDate';
import Icon from '../../../../components/Icon';

const Header = ({ data = {} }) => {

  const receipts = data.receipts || {};

  const user = data.user || {};

  const receiptsData = () => {
    switch (data.type) {
      case ReceiptsEnums.instockOrder:
      case ReceiptsEnums.error:
      case ReceiptsEnums.outstockOrder:
      case ReceiptsEnums.maintenance:
      case ReceiptsEnums.stocktaking:
      case ReceiptsEnums.allocation:
        return {
          coding: receipts.coding,
          statusName: receipts.statusName,
        };
      default:
        return {};
    }
  };

  return <div className={style.header}>
    <Avatar className={style.avatar} src={user.avatar} size={60}>
      {user.name && user.name.substring(0, 1)}
    </Avatar>
    <div className={style.data}>
      <div className={style.line}>
        <div className={style.name}>
          {data.taskName}
        </div>
        <span>
          <Icon type='icon-dian' /> {receiptsData().statusName || '进行中'}
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
