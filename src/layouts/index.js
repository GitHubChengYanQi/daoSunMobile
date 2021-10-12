import React from 'react';
import { Button, SafeArea, SegmentedControl } from 'weui-react-v2';
import { Affix } from 'antd';
import { router } from 'umi';
import styles from './index.css';
import Icon from '../pages/components/Icon';
import cookie from 'js-cookie';
import Auth from '../components/Auth';

function BasicLayout(props) {

  window.scrollTo(0, 0);

  return (
    <Auth>
      <SafeArea style={{ minHeight: '100vh', backgroundColor: '#f4f4f4' }}>
        {props.children}
      </SafeArea>
      {cookie.get('cheng-token') && <Affix offsetBottom={0}>
        <SegmentedControl className={styles.tab} style={{ backgroundColor: '#fff' }} data={
          [
            {
              label: <div style={{ textAlign: 'center', padding: '4px 0' }}>
                <Button
                  type='text'
                  style={{ padding: 0 }}
                  icon={<Icon type='icon-shouye' />}
                />
                <br />
                首页
              </div>,
              value: '/Home',
            },
            {
              label: <div style={{ textAlign: 'center' }}>
                <Button
                  type='text'
                  style={{ padding: 0 }}
                  icon={<Icon type='icon-xiaoxi' />}
                />
                <br />
                通知
              </div>,
              value: '/Notice',
            },
            {
              label: <div style={{ textAlign: 'center' }}>
                <Button
                  type='text'
                  style={{ padding: 0 }}
                  icon={<Icon type='icon-fenlei' />}
                />
                <br />
                工作
              </div>,
              value: '/Work',
            },
            {
              label: <div style={{ textAlign: 'center' }}>
                <Button
                  type='text'
                  style={{ padding: 0 }}
                  icon={<Icon type='icon-shuju' />}
                />
                <br />
                报表
              </div>,
              value: '/Report',
            },
            // {
            //   label: <div style={{ textAlign: 'center' }}>
            //     <Button
            //       type='text'
            //       style={{ padding: 0 }}
            //       icon={<UserOutlined />}
            //     />
            //     <br />
            //     我的
            //   </div>,
            //   value: '/User',
            // },
          ]

        } defaultValue={window.sessionStorage.getItem('nav') || '/Home'} onChange={(value) => {
          window.sessionStorage.setItem('nav', value);
          router.push(value);
        }} />
      </Affix>}
    </Auth>
  );
}

export default BasicLayout;
