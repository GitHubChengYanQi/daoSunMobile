import Home from './Home';
import { SafeArea, TabBar } from 'antd-mobile';
import Icon from './components/Icon';
import { getHeader } from './components/GetHeader';
import React, { useEffect, useState } from 'react';
import Notice from './Notice';
import OrCode from './OrCode';
import Work from './Work';
import Report from './Report';
import IsDev from '../components/IsDev';
import { connect } from 'dva';
import style from './index.css';
import * as VConsole from 'vconsole';

const iconSize = getHeader() ? 30 : 40;

const Index = (props) => {

  const userInfo = props.userInfo;

  if (!IsDev() && userInfo && userInfo.name === '程彦祺') {
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

  useEffect(() => {
    if (!props.userInfo) {
      props.dispatch({
        type: 'userInfo/getUserInfo',
      });
    }
  }, []);


  return (
    <>
      {content()}
      {nav && <div style={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        zIndex: 999,
        backgroundColor: '#fff',
        boxShadow: 'rgb(24, 69, 181,0.1) 0px 0px 10px',
      }}>
        <TabBar
          className={style.tabBarItem}
          safeArea
          activeKey={module}
          onChange={(value) => {
            route(value);
            setModule(value);
          }}>
          <TabBar.Item
            title='首页'
            key='/Home'
            icon={(check) => {
              return <Icon style={{ fontSize: iconSize }} type={check ? 'icon-shouye-xuanzhong' : 'icon-shouye2'} />;
            }}
          />
          <TabBar.Item
            title='通知'
            key='/Notice'
            icon={(check) => {
              return <Icon style={{ fontSize: iconSize }} type={check ? 'icon-tongzhi-xuanzhong' : 'icon-tongzhi'} />;
            }}
          />
          {(getHeader() || IsDev()) &&
          <TabBar.Item
            title='扫码'
            key='/OrCode'
            icon={(check) => {
              return <Icon style={{ fontSize: iconSize }} type={check ? 'icon-saoma-xuanzhong' : 'icon-saoma'} />;
            }}
          />
          }
          <TabBar.Item
            title='工作'
            key='/Work'
            icon={(check) => {
              return <Icon style={{ fontSize: iconSize }} type={check ? 'icon-gongzuo-xuanzhong' : 'icon-gongzuo'} />;
            }}
          />
          <TabBar.Item
            title='报表'
            key='/Report'
            icon={(check) => {
              return <Icon style={{ fontSize: iconSize }} type={check ? 'icon-baobiao-xuanzhong' : 'icon-baobiao'} />;
            }}
          />
        </TabBar>
        <SafeArea position='bottom' />
      </div>}
    </>
  );
};

export default connect(({ userInfo, qrCode }) => ({ userInfo, qrCode }))(Index);
