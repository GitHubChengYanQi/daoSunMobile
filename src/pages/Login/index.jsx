import { useRequest } from '../../util/Request';
import cookie from 'js-cookie';
import { Button, Checkbox, Divider, Form, Input, Toast } from 'antd-mobile';
import React, { useState } from 'react';
import style from './index.css';
import { connect } from 'dva';
import { useModel } from '../../.umi/plugin-model/useModel';
import Icon from '../components/Icon';
import { useBoolean } from 'ahooks';
import { EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons';
import { Logo } from '../Logo';


export const Username = (props) => {
  return <div className={style.account}>
    <Icon type='icon-zhanghao' />
    <Input
      className={style.accountInput}
      name='account'
      placeholder='请输入手机号/邮箱/账号'
      autoComplete='off'
      {...props}
    />
  </div>;
};

export const Password = ({ showPassword, toggle, ...props }) => {

  return <div className={style.account}>
    <Icon type='icon-a-lianji1' />
    <Input
      className={style.accountInput}
      type={showPassword ? 'password' : 'text'}
      placeholder='请输入密码'
      {...props}
    />
    <Button onClick={() => {
      toggle();
    }} fill='none' style={{ padding: 0 }}>
      {showPassword ? <EyeOutline /> : <EyeInvisibleOutline />}
    </Button>
  </div>;
};

export const VerificationCode = (props) => {

  const [count, setCount] = useState(0);

  const codeChange = () => {
    setCount(parseInt(Math.random() * 10, 10));
  };

  return <div className={style.account}>
    <Icon type='icon-yanzhengma' />
    <Input
      className={style.accountInput}
      placeholder='请输入验证码'
      {...props}
    />
    <img onClick={codeChange} src={`${process.env.api}/kaptcha?${count}`} height='24px' />
  </div>;
};

const Login = () => {

  const { initialState, refresh } = useModel('@@initialState');

  const [showPassword, { toggle }] = useBoolean(true);

  const { loading, run } = useRequest(
    {
      url: '/login/wxCp',
      method: 'POST',
    }, {
      manual: true,
      onSuccess: async (res) => {
        if (res) {
          cookie.set('cheng-token', res);
          await refresh();
        }
      },
    },
  );

  return (
    <div className={style.login}>
      <div className={style.formDiv}>
        <div style={{ textAlign: 'center' }} className={style.logo}>
          <img src={Logo().logo1} width='87' height={87} alt='' />
        </div>
        <div className={style.enterpriseName}>{process.env.enterpriseName}</div>
        <Form
          className={style.form}
          onFinish={(values) => {
            if (initialState && !values.kaptchaOpen) {
              return Toast.show({ content: '请输入验证码!', position: 'bottom' });
            }
            run(
              {
                data: { ...values },
              },
            );
          }}
          layout='horizontal'
          footer={
            <div>
              <div hidden className={style.foterAction}>
                <div className={style.privacy}>
                  《隐私政策》
                </div>
                <div style={{ flexGrow: 1 }} />
                <div className={style.remember}>
                  <Checkbox icon={(checked) => {
                    return checked ? <Icon type='icon-a-jianqudingceng2' /> : <Icon type='icon-jizhumimamoren' />;
                  }}>记住密码</Checkbox>
                </div>
              </div>
              <Button
                className={style.submit}
                color='primary'
                loading={loading}
                size='large'
                block
                type='submit'
              >
                {loading ? '登录中' : '立即登录'}
              </Button>
              <Divider className={style.password} style={{ margin: 0 }}>忘记登录密码</Divider>
              <div className={style.technical}>
                本系统由<a>道昕网络</a>提供技术支持
              </div>
            </div>

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
            <Password showPassword={showPassword} toggle={toggle} />
          </Form.Item>
          <Form.Item hidden={!initialState} name='kaptchaOpen'>
            <VerificationCode />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default connect(({ qrCode }) => ({ qrCode }))(Login);
