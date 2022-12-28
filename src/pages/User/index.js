import React, { useEffect, useRef, useState } from 'react';
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
import { ToolUtil } from '../../util/ToolUtil';
import MyEmpty from '../components/MyEmpty';
import { useHistory } from 'react-router-dom';
import { dynamicList } from '../Receipts/ReceiptsDetail/components/Dynamic';
import MyNavBar from '../components/MyNavBar';
import MyEllipsis from '../components/MyEllipsis';
import moment from 'moment';
import { DownFill, RightOutline } from 'antd-mobile-icons';
import StartEndDate from '../components/StartEndDate';


const getUserInfo = { url: '/rest/mgr/getUserInfo', method: 'GET' };
const logOut = { url: '/login/cpLogOut', method: 'GET' };
const selfDynamic = { url: '/dynamic/lsitBySelf', method: 'POST' };
const userDynamic = { url: '/dynamic/listByUser', method: 'POST' };

const User = ({ userId }) => {

  const [userData, setUserData] = useState();

  const [date, setDate] = useState([]);

  const history = useHistory();

  const dynamicRef = useRef();

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
    <MyNavBar title='我的' noDom />
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
            <MyEllipsis width='100%'>{userData.deptName} - {userData.positionNames}</MyEllipsis>
          </div>
          <div className={style.dept} hidden={userId}>
            <MyRemoveButton
              icon={<Icon type='icon-tuichudenglu' style={{ fontSize: 24 }} />}
              content='是否退出登录'
              onRemove={logOutRun}
            >
              <div className={style.outLogin}>退出登录</div>
            </MyRemoveButton>
          </div>
        </div>
      </div>

      <div hidden className={style.actions}>
        <div style={{ border: 'none' }}>
          <Icon type='icon-tuichudenglu' style={{ fontSize: 44 }} />
          <div>操作手册</div>
        </div>
        <div>
          <Icon type='icon-tuichudenglu' style={{ fontSize: 44 }} />
          <div>操作说明</div>
        </div>
      </div>

      <MyCard
        title='动态日志'
        titleClassName={style.dynamicTitle}
        bodyClassName={style.dynamicContent}
        className={style.dynamic}
        headerClassName={style.dynamicHeader}
        extra={<StartEndDate
          minWidth='auto'
          precision='day'
          max={new Date()}
          render={<div className={style.date}>
            {date.length === 2 ? <>{moment(date[0]).format('YYYY/MM/DD')} - {moment(date[1]).format('YYYY/MM/DD')}</> : '请选择时间'}
            <DownFill />
          </div>}
          value={date}
          onChange={(date) => {
            dynamicRef.current.submit({
              userId: userId || userInfo.id,
              beginTime: date[0],
              endTime: date[1],
            });
            setDate(date);
          }}
        />}
      >
        <MyList
          ref={dynamicRef}
          api={dynamicList}
          params={{ userId: userId || userInfo.id }}
          data={dynamicData}
          getData={setDynamicData}
        >
          {
            dynamicData.map((item, index) => {
              let content = '-';
              switch (item.source) {
                case 'processTask':
                  content = '关联任务：' + (item.taskResult?.theme || '无');
                  break;
                default:
                  break;
              }
              return <div
                key={index}
                className={style.dynamicItem}
                onClick={() => {
                  switch (item.source) {
                    case 'processTask':
                      history.push(`/Receipts/ReceiptsDetail?id=${item.taskResult?.processTaskId}`);
                      break;
                    default:
                      break;
                  }
                }}
              >
                <div className={style.header}>
                  <div className={style.title}><MyEllipsis width='100%'>{item.content || '-'}</MyEllipsis></div>
                  <div className={style.time}>{ToolUtil.timeDifference(item.createTime)}</div>
                </div>
                <div className={style.content}>
                  <div>{content}</div>
                  <RightOutline />
                </div>
              </div>;
            })
          }
        </MyList>
      </MyCard>
    </div>
  </div>;
};

export default User;
