import React from 'react';
import style from './index.less';
import { Avatar } from 'antd-mobile';

export const UserName = ({ user = {}, size }) => {

  if (!user.name) {
    return '无';
  }

  return <span className={style.userName}>
    <Avatar src={user.avatar || ''} style={{ '--size': `${size || 32}px` }} />
    <div>
      <div>{user.name}</div>
      <div style={{ fontSize: 12, color: 'rgb(148 148 148)' }}>{user.dept}-{user.role}</div>
    </div>
  </span>;
};
