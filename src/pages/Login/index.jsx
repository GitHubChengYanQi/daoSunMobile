import { useRequest } from '../../util/Request';
import cookie from 'js-cookie';
import { Button, Checkbox, Divider, Input } from 'antd-mobile';
import React, { useEffect, useRef, useState } from 'react';
import style from './index.less';
import { connect, useHistory } from 'dva';
import { useLocation, useModel } from 'umi';
import Icon from '../components/Icon';
import { useBoolean } from 'ahooks';
import { EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons';
import { FormProvider,Field } from '@formily/react';
import { createForm } from '@formily/core';
import { MyLoading } from '../components/MyLoading';
import MyDialog from '../components/MyDialog';
import GetUserInfo from '../GetUserInfo';
import { Message } from '../components/Message';
import { ToolUtil } from '../components/ToolUtil';

export const Username = (props) => {
  return <div className={style.account}>
    <Icon type='icon-zhanghao' />
    <Input
      className={style.accountInput}
      name='account'
      placeholder='请输入账号'
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

  const history = useHistory();

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
          Message.successToast('登录成功!', () => {
            props.dispatch({
              type: 'data/clearState',
            });
            cookie.set('cheng-token', res);
            refresh();
          },true);
        } else {
          Message.errorToast('登录失败!');
        }
      },
      onError: (res) => {
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
    const token = GetUserInfo().token;
    const userInfo = GetUserInfo().userInfo || {};
    const type = userInfo.hasOwnProperty('type');

    if (token && !type && query.backUrl && ToolUtil.queryString('login', history.location.pathname)) {
      history.push('/');
    }
  }, []);


  return <div className={style.login}>
    <div className={style.formDiv}>
      <div style={{ textAlign: 'center' }} className={style.logo}>
        {state.loginLogo && <img src={state.loginLogo} width='87' height={87} alt='' />}
      </div>
      <div className={style.enterpriseName}>欢迎使用{state.systemName}</div>

      <div className={style.form}>
        <FormProvider form={form}>
          <Field name='username' component={[Username]} />
          <Field name='password' component={[Password]} />
          <Field
            hidden={kaptchaOpen !== true}
            name='kaptchaOpen'
            component={[VerificationCode, { count, codeChange }]}
          />
        </FormProvider>
      </div>

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

export default connect(({ qrCode, data }) => ({ qrCode, data }))(Login);
