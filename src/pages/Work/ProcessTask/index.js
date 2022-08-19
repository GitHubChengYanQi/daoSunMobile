import React, { useState } from 'react';
import MyNavBar from '../../components/MyNavBar';
import style from './index.less';
import Icon from '../../components/Icon';
import MyTablBar from '../../components/MyTablBar';
import MyAudit from './MyAudit';
import Create from './Create';
import { useModel } from 'umi';
import KeepAlive from '../../../components/KeepAlive';

export const Tasks = () => {

  const [key, setKey] = useState('audit');

  const { initialState } = useModel('@@initialState');
  const state = initialState || {};
  const userInfo = state.userInfo || {};

  const [scrollTop, setScrollTop] = useState(0);

  const content = () => {
    switch (key) {
      case 'create':
        return <Create />;
      case 'audit':
        return <MyAudit auditType='audit' />;
      case 'start':
        return <MyAudit createUser={userInfo.id} />;
      case 'send':
        return <MyAudit auditType='send' />;
      default:
        return <Create />;
    }
  };

  return <div className={style.process} style={{scrollMarginTop:scrollTop}}>
    <div className={style.content} id='content' onScroll={(event) => {
      setScrollTop(event.target.scrollTop);
    }}>
      <MyNavBar title='审批中心' />
      {content()}
    </div>

    <MyTablBar
      onChange={setKey}
      activeKey={key}
      tabBarItems={
        [{
          title: '新申请',
          key: 'create',
          icon: <Icon type='icon-xinshenqing' />,
        }, {
          title: '我审批的',
          key: 'audit',
          icon: <Icon type='icon-shenpiguanli' />,
        }, {
          title: '我发起的',
          key: 'start',
          icon: <Icon type='icon-wofaqide1' />,
        }, {
          title: '抄送我的',
          key: 'send',
          icon: <Icon type='icon-caigou_chaosong' />,
        }]
      } />

  </div>;
};

const ProcessTask = () => {

  return <KeepAlive id='task' contentId='content'>
    <Tasks />
  </KeepAlive>;
};

export default ProcessTask;
