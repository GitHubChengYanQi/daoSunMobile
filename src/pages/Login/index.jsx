import { useRequest } from '../../util/Request';
import cookie from 'js-cookie';
import { Button, Checkbox, Dialog, Divider, Input } from 'antd-mobile';
import React, { useEffect, useState } from 'react';
import style from './index.less';
import { connect } from 'dva';
import { useModel } from '../../.umi/plugin-model/useModel';
import Icon from '../components/Icon';
import { useBoolean } from 'ahooks';
import { EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons';
import { Logo } from '../Logo';
import { Field } from '@formily/react';
import { createForm } from '@formily/core';
import { Form } from '@formily/antd';


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
    }} fill='none' style={{ padding: 0 }}>
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

const Login = () => {

  const form = createForm();

  const { initialState, refresh } = useModel('@@initialState');

  const [count, setCount] = useState(0);

  const codeChange = () => {
    setCount(parseInt(Math.random() * 10, 10));
  };

  const kaptchaOpen = initialState.kaptchaOpen;

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
      onError: () => {
        codeChange();
      },
    },
  );

  const submit = () => {
    form.submit((values) => {
      if (kaptchaOpen && !values.kaptchaOpen) {
        return Dialog.alert({ content: '请输入验证码!', confirmText: '重新输入', closeOnMaskClick: true });
      }
      if (!values.username || !values.password) {
        return Dialog.alert({ content: '请输入正确的账户或密码!', confirmText: '重新输入', closeOnMaskClick: true });
      }
      run(
        {
          data: { ...values },
        },
      );
    });
  };

  return <div className={style.login}>
    <div className={style.formDiv}>
      <div style={{ textAlign: 'center' }} className={style.logo}>
        <img src={Logo().logo1} width='87' height={87} alt='' />
      </div>
      <div className={style.enterpriseName}>{process.env.enterpriseName}</div>

      <Form
        className={style.form}
        form={form}
        layout='vertical'
        feedbackLayout='terse'
      >
        <Field name='username' component={[Username]} />
        <Field name='password' component={[Password]} />
        <Field hidden={!kaptchaOpen} name='kaptchaOpen' component={[VerificationCode, { count, codeChange }]} />
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
      <Divider className={style.password} style={{ margin: 0 }}>忘记登录密码</Divider>
      <div className={style.technical}>
        本系统由<a>道昕网络</a>提供技术支持
      </div>
    </div>
  </div>;
};

export default connect(({ qrCode }) => ({ qrCode }))(Login);
