import React  from 'react';
import MyNavBar from '../../components/MyNavBar';
import style from './index.less';
import { ReceiptsEnums } from '../../Receipts';
import { useModel } from 'umi';
import MyAudit from '../ProcessTask/MyAudit';

const MyPicking = () => {

  const { initialState } = useModel('@@initialState');
  const state = initialState || {};
  const userInfo = state.userInfo || {};

  return <div className={style.myPicking}>
    <MyNavBar title='领料中心' />

    <MyAudit
      noType
      task
      type={ReceiptsEnums.outstockOrder}
      pickUserId={userInfo.id}
      defaultScreen={{userName:userInfo.name}}
    />
  </div>;

};

export default MyPicking;
