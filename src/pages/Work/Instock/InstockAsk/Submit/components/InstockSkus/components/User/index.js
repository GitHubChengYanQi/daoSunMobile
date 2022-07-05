import React, { useRef } from 'react';
import style from '../../../PurchaseOrderInstock/index.less';
import CheckUser from '../../../../../../../../components/CheckUser';
import { RightOutline } from 'antd-mobile-icons';
import Title from '../../../../../../../../components/Title';

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
    <div className={style.dataItem}>
      <Title className={style.title}>{title}<span>*</span></Title>
      <div onClick={() => {
        userRef.current.open();
      }}>
        {id ? name : '请选择'}<RightOutline />
      </div>
    </div>

    <CheckUser ref={userRef} value={id} onChange={(id, name) => {
      onChange(id, name);
    }} />
  </>;
};

export default User;
