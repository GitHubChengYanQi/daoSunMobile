import React from 'react';
import { SafeArea } from 'weui-react-v2';
import { router } from 'umi';
import Icon from '../pages/components/Icon';
import { TabBar } from 'antd-mobile';
import { QrcodeOutlined } from '@ant-design/icons';
import Auth from '../components/Auth';


function BasicLayout(props) {

  window.scrollTo(0, 0);

  const nav = props.history.location.pathname.split('/')[1] !== 'OrCode'
    &&
    props.history.location.pathname.split('/')[1] !== 'Login'
    &&
    props.history.location.pathname.split('/').length <= 2;

  const bottomNav = () => {
    return <>
      <SafeArea style={{ minHeight: '100vh', backgroundColor: '#f4f4f4' }}>
        {props.children}
      </SafeArea>
      {nav && <div style={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 999 }}>
        <SafeArea style={{ backgroundColor: '#fff' }}>
          <TabBar activeKey={`/${props.history.location.pathname.split('/')[1]}`} onChange={(value) => {

            if (process.env.NODE_ENV === 'development') {
              if (value === '/OrCode') {
                value = '/OrCode?id=1461996130619699202';
              }
            }
            router.push(value);
          }}>
            <TabBar.Item key='/Home' icon={<Icon type='icon-shouye' />} title='首页' />
            <TabBar.Item key='/Notice' icon={<Icon type='icon-xiaoxi' />} title='通知' />
            <TabBar.Item key='/OrCode' icon={<QrcodeOutlined />} title='扫码' />
            <TabBar.Item key='/Work' icon={<Icon type='icon-fenlei' />} title='工作' />
            <TabBar.Item key='/Report' icon={<Icon type='icon-shuju' />} title='报表' />
          </TabBar>
        </SafeArea>
      </div>}
    </>
  }

  return (
    <>
    {process.env.NODE_ENV === 'development' ? bottomNav() : <Auth>{bottomNav()}</Auth>}
    </>
  );
}

export default BasicLayout;
