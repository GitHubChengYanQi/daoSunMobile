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
    name,
    title,
    onChange = () => {
    },
  },
) => {

  const userRef = useRef();

  return <>
    <MyCard
      titleBom={<Title className={style.title}>{title}<span>*</span></Title>}
      extra={<div className={style.alignCenter} onClick={() => {
        userRef.current.open();
      }}>
        {id ? <div className={style.alignCenter}><UserName user={{name}} /></div> : '请选择'}<RightOutline />
      </div>}
    />

    <CheckUser ref={userRef} value={id} onChange={(id, name) => {
      onChange(id, name);
    }} />
  </>;
};

export default User;
