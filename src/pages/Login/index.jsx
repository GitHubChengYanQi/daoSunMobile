import { useRequest } from '../../util/Request';
import cookie from 'js-cookie';
import { history } from 'umi';
import { Button, Form, Input, Space } from 'antd-mobile';
import React from 'react';
import logo from '../../assets/logo.png';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import style from './index.css';
import { getHeader } from '../components/GetHeader';

export const Username = (props) => {
  return <Space style={{ width: '100%' }}>
    <UserOutlined />
    <Input
      style={{ width: '80vw' }}
      name='account'
      placeholder='手机号/邮箱/账号'
      autoComplete='off'
      {...props}
    />
  </Space>;
};

export const Password = (props) => {
  return <Space>
    <LockOutlined />
    <Input
      style={{ width: '80vw' }}
      type='password'
      placeholder='请填写最低长度为6位的密码'
      {...props}
    />
  </Space>;
};

const Login = () => {

  const { run } = useRequest(
    {
      url: '/login/wxCp',
      method: 'POST',
    }, {
      manual: true,
      onSuccess: async (res) => {
        if (res) {
          await cookie.set('cheng-token', res);
          await history.push('/');
        }
      },
    },
  );

  return (
    <div className={style.login} style={{ backgroundColor: '#fff', height: '100vh' }}>
      <div style={{ textAlign: 'center', padding: 24 }}>
        <Space direction='vertical'>
          <img src={logo} width='20%' alt='' />
          <h2 style={{ fontWeight: 'bolder' }}>道昕智造</h2>
        </Space>
      </div>
      <Form
        onFinish={(values) => {
          run(
            {
              data: { ...values },
            },
          );
        }}
        layout='horizontal'
        footer={
          <Button size='large' block type='submit'
                  style={{ backgroundColor: '#1845B5', color: '#fff', '--border-radius': '20px' }}>
            登录
          </Button>
        }
      >
        <Form.Item name='username' rules={[{ required: true, message: '请填写：手机号/邮箱/账号' }]}>
          <Username />
        </Form.Item>
        <Form.Item name='password' rules={[
          { required: true, message: '请填写密码' },
          () => ({
            validator(rule, value) {
              if (!value || value.length >= 6) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('密码长度不应低于6位!'));
            },
          }),
        ]}>
          <Password />
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
