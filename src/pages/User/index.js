import React, { useState } from 'react';
import { history, useModel } from 'umi';
import { Avatar } from 'antd-mobile';
import style from './index.less';
import { useRequest } from '../../util/Request';
import { MyLoading } from '../components/MyLoading';
import cookie from 'js-cookie';
import Icon from '../components/Icon';
import MyRemoveButton from '../components/MyRemoveButton';
import MyList from '../components/MyList';
import StepList from '../Receipts/ReceiptsDetail/components/Dynamic/components/StepList';
import MyCard from '../components/MyCard';

const info = { url: '/rest/system/currentUserInfo', method: 'POST' };
const dynamic = { url: '/remarks/personalDynamic', method: 'POST' };

const User = () => {

  const { loading, data } = useRequest(info);

  const [dynamicData,setDynamicData] = useState();

  const { initialState } = useModel('@@initialState');
  const state = initialState || {};

  const customer = state.customer || {};
  const userInfo = state.userInfo || {};

  if (loading) {
    return <MyLoading />;
  }

  return <div>
    <div style={{ padding: 12 }}>
      <div className={style.card}>
        <div className={style.flexStart}>
          <Avatar src={userInfo.avatar} style={{ '--size': '60px' }} />
          <div className={style.customerName}>
            {customer.customerName}
          </div>
          <MyRemoveButton
            className={style.outLogin}
            icon={<Icon type='icon-tuichudenglu' style={{ fontSize: 24 }} />}
            content='是否退出登录'
            onRemove={() => {
              cookie.remove('cheng-token');
              history.push('/Login');
            }}
          />
        </div>
        <div className={style.userInfo}>
          <div className={style.name}>{userInfo.name}</div>
          <div className={style.dept}>
            {data.deptName} - {data.positionNames}
          </div>
        </div>
      </div>

      <MyCard title='个人动态' bodyClassName={style.dynamicContent} className={style.dynamic} headerClassName={style.dynamicHeader}>
        <MyList api={dynamic} data={dynamicData} getData={setDynamicData}>
          <StepList className={style.description} imgHidden nameHidden remarks={dynamicData} />
        </MyList>
      </MyCard>
    </div>
  </div>;
};

export default User;
