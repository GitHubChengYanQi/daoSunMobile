import React, { useState } from 'react';
import { useRequest } from '../util/Request';
import { Button, Flex, FlexItem, GridItem, SafeArea, SegmentedControl } from 'weui-react-v2';
import  {
  AppstoreOutlined,
  BarChartOutlined,
  CommentOutlined, FieldStringOutlined, LeftOutlined,
  ShakeOutlined,
  UserOutlined,
  WechatOutlined,
} from '@ant-design/icons';
import { Affix, Avatar, Image, Menu } from 'antd';
import { router } from 'umi';
import { Grid } from 'antd-mobile';
import styles from './index.css';
import Icon from '../pages/components/Icon';

function BasicLayout(props) {

  let [isNotLogin, setIsNotLogin] = useState(true);

  const { run: refreshToken } = useRequest({
    url: '/login/refreshToken',
    method: 'POST',
  }, {
    manual: true,
  }, false);

  const { error, run } = useRequest({
    url: '/login/miniprogram/code2session',
    method: 'POST',
  }, {
    onError() {
      /**
       * TODO 判断error 存在就显示登录失败的提示
       */
      console.log('登录失败');
      // Taro.hideLoading();
    },
    manual: true,
  });

  const { error: codeError, run: codeRun } = useRequest({
    url: '/login/oauth/wxMp',
    method: 'GET',
  }, {
    manual: true,
  });

  const { error: tokenError, run: tokenRun } = useRequest({
    url: '/login/mp/loginByCode',
    method: 'GET',
  }, {
    manual: true,
    onError: () => {
      // wxLogin();
    },
  });

  return (
    <div>
      <SafeArea style={{ minHeight: '100vh', backgroundColor: '#f4f4f4' }}>
        {props.children}
      </SafeArea>
      <Affix offsetBottom={0}>
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
      </Affix>
    </div>
  );
}

export default BasicLayout;
