import React, { useEffect, useState } from 'react';
import MyNavBar from '../../components/MyNavBar';
import style from './index.less';
import Icon from '../../components/Icon';
import MyTablBar from '../../components/MyTablBar';
import MyAudit from './MyAudit';
import Create from './Create';
import MyStart from './MyStart';
import { useLocation } from 'react-router-dom';


export const Tasks = () => {

  const [key, setKey] = useState('audit');

  const [scrollTop, setScrollTop] = useState();

  const location = useLocation();

  const content = () => {
    switch (key) {
      case 'create':
        return <Create />;
      case 'audit':
        return <MyAudit auditType='audit' />;
      case 'start':
        return <MyStart />;
      case 'send':
        return <MyAudit auditType='send' />;
      default:
        return <Create />;
    }
  };

  const initScroll = () => {
    // const content = document.getElementById('content');
    // console.log(content,scrollTop);
    // if (content) {
    //   content.scrollTop = scrollTop;
    // }
  };

  useEffect(() => {
    initScroll();
  }, [location]);


  return <div className={style.process} id='process'>
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
  return <Tasks />;
  // return <KeepAlive id='Test'>
  //   <Tasks />
  // </KeepAlive>;
};

export default ProcessTask;
