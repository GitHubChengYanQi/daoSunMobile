import Home from './Home';
import { TabBar } from 'antd-mobile';
import Icon from './components/Icon';
import React, { useState } from 'react';
import Notice from './Notice';
import OrCode from './OrCode';
import Work from './Work';
import Report from './Report';
import IsDev from '../components/IsDev';
import { connect } from 'dva';
import style from './index.less';
import * as VConsole from 'vconsole';
import { useModel } from '../.umi/plugin-model/useModel';

const iconSize = 20;

const Index = (props) => {

  const { initialState } = useModel('@@initialState');

  if (!IsDev() && initialState.name === '程彦祺') {
    new VConsole();
  }

  const nav =
    props.history.location.pathname.split('/')[1] !== 'OrCode'
    &&
    props.history.location.pathname.split('/')[1] !== 'Login'
    &&
    props.history.location.pathname.split('/').length <= 2;

  const routes = props.qrCode && props.qrCode.route;

  const [module, setModule] = useState(routes || '/Home');

  const route = (name) => {
    props.dispatch({
      type: 'qrCode/scanCodeState',
      payload: {
        route: name,
      },
    });
  };

  const content = () => {
    switch (module) {
      case '/Home':
        return <Home {...props} />;
      case '/Notice':
        return <Notice {...props} />;
      case '/OrCode':
        return <OrCode {...props} />;
      case '/Work':
        return <Work {...props} />;
      case '/Report':
        return <Report {...props} />;
      default:
        return <></>;
    }
  };


  return (
    <div className={style.pageIndex}>
      <div className={style.content}>
        {content()}
      </div>
      {nav && <TabBar
        className={style.tabBarItem}
        safeArea
        activeKey={module}
        onChange={(value) => {
          route(value);
          setModule(value);
        }}>
        <TabBar.Item
          title='任务'
          key='/Notice'
          icon={<Icon style={{ fontSize: iconSize }} type='icon-renwu1' />}
        />
        <TabBar.Item
          title='消息'
          key='/OrCode'
          icon={<Icon style={{ fontSize: iconSize }} type='icon-xiaoxi2' />}
        />
        <TabBar.Item
          title={module === '/Home' ? '扫码' : '首页'}
          key='/Home'
          icon={<Icon
            style={{ fontSize: iconSize }}
            type={module === '/Home' ? 'icon-dibudaohang-saoma' : 'icon-shouye3'}
          />}
        />
        <TabBar.Item
          title='报表'
          key='/Work'
          icon={<Icon style={{ fontSize: iconSize }} type='icon-baobiao1' />}
        />
        <TabBar.Item
          title='我的'
          key='/Report'
          icon={<Icon style={{ fontSize: iconSize }} type='icon-wode' />}
        />
      </TabBar>}
    </div>
  );
};

export default connect(({ qrCode }) => ({ qrCode }))(Index);
