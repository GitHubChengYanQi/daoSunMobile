import React from 'react';
import { SafeArea } from 'weui-react-v2';
import { Affix } from 'antd';
import { router } from 'umi';
import Icon from '../pages/components/Icon';
import { TabBar } from 'antd-mobile';
import { QrcodeOutlined } from '@ant-design/icons';
import Auth from '../components/Auth';

let url = '/Home';

function BasicLayout(props) {

  window.scrollTo(0, 0);

  const nav = props.history.location.pathname.split('/')[1] !== 'Login' && props.history.location.pathname.split('/').length <= 2;

  return (
    <>
      <Auth>
        <SafeArea style={{ minHeight: '100vh', backgroundColor: '#f4f4f4' }}>
          {props.children}
        </SafeArea>
        {nav && <Affix offsetBottom={0}>
          <SafeArea style={{ backgroundColor: '#fff' }}>
            <TabBar activeKey={url} onChange={(value) => {
              url = value;
              router.push(value);
            }}>
              <TabBar.Item key='/Home' icon={<Icon type='icon-shouye' />} title='首页' />
              <TabBar.Item key='/Notice' icon={<Icon type='icon-xiaoxi' />} title='通知' />
              <TabBar.Item key='/OrCode' icon={<QrcodeOutlined />} title='扫码' />
              <TabBar.Item key='/Work' icon={<Icon type='icon-fenlei' />} title='工作' />
              <TabBar.Item key='/Report' icon={<Icon type='icon-shuju' />} title='报表' />
            </TabBar>
          </SafeArea>
        </Affix>}
      </Auth>
    </>
  );
}

export default BasicLayout;
