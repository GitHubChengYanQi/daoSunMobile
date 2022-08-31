import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Avatar } from 'antd-mobile';
import style from './index.less';
import { useRequest } from '../../util/Request';
import { MyLoading } from '../components/MyLoading';
import cookie from 'js-cookie';
import Icon from '../components/Icon';
import MyRemoveButton from '../components/MyRemoveButton';
import MyList from '../components/MyList';
import MyCard from '../components/MyCard';
import { ToolUtil } from '../components/ToolUtil';
import MyEmpty from '../components/MyEmpty';
import { useHistory } from 'react-router-dom';


const getUserInfo = { url: '/rest/mgr/getUserInfo', method: 'GET' };
const logOut = { url: '/login/cpLogOut', method: 'GET' };
const selfDynamic = { url: '/dynamic/lsitBySelf', method: 'POST' };
const userDynamic = { url: '/dynamic/listByUser', method: 'POST' };

const User = ({ userId }) => {

  const [userData, setUserData] = useState();

  const history = useHistory();

  const { loading, run } = useRequest(getUserInfo, {
    manual: true,
    onSuccess: (res) => {
      const user = res || {};
      setUserData({
        avatar: res.avatar,
        name: res.name,
        deptName: user.deptName,
        positionNames: user.positionNames,
      });
    },
    onError: () => {
      if (userId) {
        history.goBack();
      }
    },
  });

  const { run: logOutRun } = useRequest(logOut, {
    manual: true,
    onSuccess: (res) => {
      cookie.remove('cheng-token');
      window.location.reload();
    },
  });

  const [dynamicData, setDynamicData] = useState([]);

  const { initialState } = useModel('@@initialState');
  const state = initialState || {};

  const userInfo = state.userInfo || {};

  useEffect(() => {
    if (userId) {
      run({ params: { userId: userId } });
    } else {
      setUserData({
        avatar: userInfo.avatar,
        name: userInfo.name,
        deptName: ToolUtil.isArray(userInfo.dept).toString(),
        positionNames: ToolUtil.isArray(userInfo.role).toString(),
      });
    }
  }, []);

  if (loading) {
    return <MyLoading />;
  }

  if (!userData) {
    return <MyEmpty description='暂无人员信息' />;
  }

  return <div>
    <div style={{ padding: 12 }}>
      <div className={style.card}>
        <div className={style.flexStart}>
          <div className={style.customerName}>
            {state.enterpriseName || '--'}
          </div>
          <Avatar src={userData.avatar} style={{ '--size': '60px' }} />
        </div>
        <div className={style.userInfo}>
          <div className={style.name}>{userData.name}</div>
          <div className={style.describe}>
            {userData.deptName}
          </div>
          <div className={style.describe}>
            {userData.positionNames}
          </div>
          <div className={style.dept} hidden={userId}>
            <MyRemoveButton
              className={style.outLogin}
              icon={<Icon type='icon-tuichudenglu' style={{ fontSize: 24 }} />}
              content='是否退出登录'
              onRemove={logOutRun}
            >退出登录</MyRemoveButton>
          </div>
        </div>
      </div>

      <MyCard
        title='个人动态'
        bodyClassName={style.dynamicContent}
        className={style.dynamic}
        headerClassName={style.dynamicHeader}
      >
        <MyList
          api={userId ? userDynamic : selfDynamic}
          params={{ userId }}
          data={dynamicData}
          getData={setDynamicData}
        >
          {
            dynamicData.map((item, index) => {
              return <div key={index} className={style.dynamicItem}>
                <div>{item.type}{item.sourceName}</div>
                <div className={style.time}>{ToolUtil.timeDifference(item.createTime)}</div>
              </div>;
            })
          }
        </MyList>
      </MyCard>
    </div>
  </div>;
};

export default User;
