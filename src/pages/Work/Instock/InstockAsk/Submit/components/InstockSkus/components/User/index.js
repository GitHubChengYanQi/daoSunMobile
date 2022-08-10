import React, { useRef } from 'react';
import style from '../../../PurchaseOrderInstock/index.less';
import CheckUser from '../../../../../../../../components/CheckUser';
import { RightOutline } from 'antd-mobile-icons';
import Title from '../../../../../../../../components/Title';
import MyCard from '../../../../../../../../components/MyCard';
import { UserName } from '../../../../../../../../components/User';

const User = (
  {
    id,
    multiple,
    name,
    avatar,
    title,
    onChange = () => {
    },
    noRequired,
  },
) => {

  const userRef = useRef();

  return <>
    <MyCard
      titleBom={<Title className={style.title}>{title}<span hidden={noRequired}>*</span></Title>}
      extra={<div className={style.alignCenter} onClick={() => {
        userRef.current.open();
      }}>
        {id ? <div className={style.alignCenter}><UserName user={{ avatar, name }} /></div> : '请选择'}<RightOutline />
      </div>}
    />

    <CheckUser multiple={multiple} ref={userRef} value={id} onChange={(users) => {
      const user = users[0] || {};
      onChange(user);
    }} />
  </>;
};

export default User;
