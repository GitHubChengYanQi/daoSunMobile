import { useRequest } from '../../util/Request';
import cookie from 'js-cookie';
import { Button, Checkbox, Divider, Input, Toast } from 'antd-mobile';
import React, { useEffect, useRef, useState } from 'react';
import style from './index.less';
import { connect } from 'dva';
import { useLocation, useModel } from 'umi';
import Icon from '../components/Icon';
import { useBoolean } from 'ahooks';
import { EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons';
import { Field } from '@formily/react';
import { createForm } from '@formily/core';
import { Form } from '@formily/antd';
import { MyLoading } from '../components/MyLoading';
import MyDialog from '../components/MyDialog';


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

export const Password = (props) => {

  const [showPassword, { toggle }] = useBoolean(true);

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
    }} fill='none' style={{ padding: 0, color: 'rgb(126 123 123)' }}>
      {showPassword ? <EyeOutline /> : <EyeInvisibleOutline />}
    </Button>
  </div>;
};

export const VerificationCode = ({ count, codeChange, ...props }) => {

  return <div className={style.account}>
    <Icon type='icon-yanzhengma' />
    <Input
      className={style.accountInput}
      placeholder='请输入验证码'
      {...props}
    />
    <img onClick={codeChange} src={`${process.env.api}/kaptcha?${count}`} height='24px' alt='' />
  </div>;
};

const form = createForm();

const Login = (props) => {

  const dialogRef = useRef();

  const { query } = useLocation();

  const { initialState, refresh, loading } = useModel('@@initialState');

  const state = initialState || {};

  const [count, setCount] = useState(0);

  const codeChange = () => {
    setCount(parseInt(Math.random() * 10, 10));
  };

  const kaptchaOpen = state.kaptchaOpen;

  const { loading: loginLoading, run } = useRequest(
    {
      url: '/login/wxCp',
      method: 'POST',
    }, {
      manual: true,
      onSuccess: async (res) => {
        if (res) {
          props.dispatch({
            type: 'data/clearState',
          });
          Toast.show({ content: '登录成功！', position: 'bottom' });
          cookie.set('cheng-token', res);
          if (query.backUrl) {
            window.location.href = query.backUrl;
          } else {
            refresh();
          }
        } else {
          Toast.show({ content: '登录失败！', position: 'bottom' });
        }
      },
      onError: () => {
        Toast.show({ content: '登录失败！', position: 'bottom' });
        codeChange();
      },
    },
  );

  const submit = () => {
    form.submit((values) => {
      if (kaptchaOpen === 'true' && !values.kaptchaOpen) {
        return dialogRef.current.open('验证码不能为空');
      }
      if (!values.username) {
        return dialogRef.current.open('账号不能为空');
      } else if (!values.password) {
        return dialogRef.current.open('密码不能为空');
      }
      return run(
        {
          data: { ...values },
        },
      );
    });
  };

  useEffect(() => {
    window.document.title = state.systemName ? `登录-${state.systemName}` : '登录';
  }, []);

  return <div className={style.login}>
    <div className={style.formDiv}>
      <div style={{ textAlign: 'center' }} className={style.logo}>
        {state.loginLogo && <img src={state.loginLogo} width='87' height={87} alt='' />}
      </div>
      <div className={style.enterpriseName}>欢迎使用{state.systemName}</div>

      <Form
        className={style.form}
        form={form}
        layout='vertical'
        feedbackLayout='terse'
      >
        <Field name='username' component={[Username]} />
        <Field name='password' component={[Password]} />
        <Field
          hidden={kaptchaOpen !== true}
          name='kaptchaOpen'
          component={[VerificationCode, { count, codeChange }]}
        />
      </Form>

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
        onClick={submit}
      >
        {loading ? '登录中' : '立即登录'}
      </Button>
      <Divider className={style.password} style={{ margin: 0 }}>
        <div onClick={() => {
          dialogRef.current.open('请联系管理员!');
        }}>
          忘记登录密码
        </div>
      </Divider>
      <div className={style.technical}>
        本系统由<a>道昕网络</a>提供技术支持
      </div>
    </div>

    <MyDialog ref={dialogRef} />

    {(loading || loginLoading) && <MyLoading />}
  </div>;
};

export default connect(({ qrCode,data }) => ({ qrCode,data }))(Login);
