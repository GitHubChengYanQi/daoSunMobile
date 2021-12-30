import { useRequest } from '../../util/Request';
import cookie from 'js-cookie';
import { history } from 'umi';
import { Button, Form, Input } from 'antd-mobile';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import React from 'react';
import logo from '../../assets/img.png';

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
    <div style={{ backgroundColor: '#fff',marginTop:24,height:'100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <img src={logo} width='40%' style={{ margin: 24 }} alt='' />
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
          <Button block type='submit' color='primary'>
            提交
          </Button>
        }
      >
        <Form.Item name='username' rules={[{ required: true, message: '请填写：手机号/邮箱/账号' }]}>
          <Input
            prefix={<UserOutlined />}
            name='account'
            placeholder='手机号/邮箱/账号'
            autoComplete='off'
          />
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
          <Input
            prefix={<LockOutlined />}
            type='password'
            placeholder='请填写最低长度为6位的密码'
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
