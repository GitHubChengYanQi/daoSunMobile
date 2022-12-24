import React from 'react';
import style from './index.less';
import { Avatar } from 'antd-mobile';
import { isArray } from '../ToolUtil';

export const UserName = ({ user = {}, size }) => {

  if (!user.name) {
    return '无';
  }

  return <span className={style.userName}>
    <Avatar src={user.avatar || ''} style={{ '--size': `${size || 35}px` }} />
    <div>
      <div>{user.name}</div>
      <div style={{ fontSize: 12, color: 'rgb(148 148 148)' }}>{user.dept || user.deptResult?.fullName} - {user.role || isArray(user.roleResults)[0]?.name}</div>
    </div>
  </span>;
};
