import React from 'react';
import style from './index.less';
import { Avatar } from 'antd-mobile';

export const UserName = ({ user = {} }) => {

  if (!user.name){
    return '无'
  }

  return <span className={style.userName}>
    <Avatar src={user.avatar || ''} style={{'--size':'20px'}} /> {user.name}
  </span>;
};
