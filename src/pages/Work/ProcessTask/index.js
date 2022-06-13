import React, { useState } from 'react';
import MyNavBar from '../../components/MyNavBar';
import style from './index.less';
import Icon from '../../components/Icon';
import MyEmpty from '../../components/MyEmpty';
import MyTablBar from '../../components/MyTablBar';
import MyAudit from './MyAudit';
import Create from './Create';
import MyStart from './MyStart';


const ProcessTask = () => {

  const [key, setKey] = useState('audit');

  const content = () => {
    switch (key) {
      case 'create':
        return <Create />;
      case 'audit':
        return <MyAudit />;
      case 'start':
        return <MyStart />;
      default:
        return <MyEmpty />;
    }
  };

  return <div className={style.process}>
    <div className={style.content} id='content'>
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
          icon: <Icon type='icon-cangchu' />,
        }, {
          title: '我审批的',
          key: 'audit',
          icon: <Icon type='icon-xiaoxi2' />,
        }, {
          title: '我发起的',
          key: 'start',
          icon: <Icon type='icon-baobiao1' />,
        }]
      } />

  </div>;
};

export default ProcessTask;
