import React from 'react';
import { router } from 'umi';
import Icon from '../pages/components/Icon';
import { SafeArea, TabBar } from 'antd-mobile';
import { QrcodeOutlined } from '@ant-design/icons';
import Auth from '../components/Auth';
// import * as VConsole from 'vconsole';


function BasicLayout(props) {

  window.scrollTo(0, 0);

  // var vConsole = new VConsole();


  const nav =
    props.history.location.pathname.split('/')[1] !== 'OrCode'
    &&
    props.history.location.pathname.split('/')[1] !== 'Login'
    &&
    props.history.location.pathname.split('/').length <= 2;

  const bottomNav = () => {
    return <div style={{height:'100vh'}}>
      <div style={{backgroundColor: '#f4f4f4',marginBottom:'10vh'}}>
        {props.children}
      </div>
      {nav && <div style={{ position:'fixed',bottom:0,width: '100%', zIndex: 999, backgroundColor: '#fff' }}>
        <TabBar activeKey={`/${props.history.location.pathname.split('/')[1]}`} onChange={(value) => {

          if (process.env.NODE_ENV === 'development') {
            if (value === '/OrCode') {
              value = '/OrCode?id=1467726432537276417';
            }
          }
          router.push(value);
        }}>
          <TabBar.Item key='/Home' icon={<Icon type='icon-shouye' style={{color:'#000'}} />} title='首页' />
          <TabBar.Item key='/Notice' icon={<Icon type='icon-xiaoxi' />} title='通知' />
          <TabBar.Item key='/OrCode' icon={<QrcodeOutlined />} title='扫码' />
          <TabBar.Item key='/Work' icon={<Icon type='icon-fenlei' />} title='工作' />
          <TabBar.Item key='/Report' icon={<Icon type='icon-shuju' />} title='报表' />
        </TabBar>
        <div style={{ background: '#ffcfac' }}>
          <SafeArea position='bottom' />
        </div>
      </div>}
      <div>
        <SafeArea position='bottom' />
      </div>
    </div>;
  };

  return (
    <>
      {process.env.NODE_ENV === 'development' ? bottomNav() : <Auth>{bottomNav()}</Auth>}
    </>
  );
}

export default BasicLayout;
