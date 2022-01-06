import Home from './Home';
import { TabBar } from 'antd-mobile';
import Icon from './components/Icon';
import { getHeader } from './components/GetHeader';
import { QrcodeOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import Notice from './Notice';
import OrCode from './OrCode';
import Work from './Work';
import Report from './Report';
import IsDev from '../components/IsDev';
import { connect } from 'dva';


const Index = (props) => {

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
        route:name,
      },
    });
  }

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
    <>
      {content()}
      {nav && <div style={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 999, backgroundColor: '#fff' }}>
        <TabBar
          safeArea
          activeKey={module}
          onChange={(value) => {
            route(value);
            setModule(value);
          }}>
          <TabBar.Item key='/Home' icon={<Icon type='icon-shouye' style={{ color: '#000' }} />} title='首页' />
          <TabBar.Item key='/Notice' icon={<Icon type='icon-xiaoxi' />} title='通知' />
          {(getHeader() || IsDev()) && <TabBar.Item key='/OrCode' icon={<QrcodeOutlined />} title='扫码' />}
          <TabBar.Item key='/Work' icon={<Icon type='icon-fenlei' />} title='工作' />
          <TabBar.Item key='/Report' icon={<Icon type='icon-shuju' />} title='报表' />
        </TabBar>
      </div>}
    </>
  );
}

export default connect(({ qrCode }) => ({ qrCode }))(Index);
