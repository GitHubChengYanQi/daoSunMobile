import { Button, Checkbox, Dialog, Toast } from 'antd-mobile';
import { useRequest } from '../../util/Request';
import React from 'react';
import { history, useModel } from 'umi';
import cookie from 'js-cookie';
import GetUserInfo from '../GetUserInfo';
import style from '../Login/index.less';
import { Form } from '@formily/antd';
import { FormProvider, Field } from '@formily/react';
import Icon from '../components/Icon';
import { createForm, onFieldReact } from '@formily/core';
import { Code, Phone } from './components/Field';
import { Message } from '../components/Message';

const form = createForm({
  effects: () => {
    onFieldReact('code', (field) => {
      field.setComponentProps({ phone: field.query('phone').get('value') });
    });
  },
});

const Sms = () => {

  const { initialState } = useModel('@@initialState');

  const state = initialState || {};

  const { loading, run } = useRequest({ url: '/login/phone', method: 'POST' }, {
    manual: true, onSuccess: (res) => {
      if (res) {
        Toast.show({ content: '手机号绑定成功！' });
        cookie.set('cheng-token', res);
        const userInfo = GetUserInfo().userInfo;
        history.push('/Login');
      }
    },
  });

  const submit = () => {
    form.submit((values) => {
      if (!values.phone) {
        return Message.warningDialog({ content: '请输入手机号!', confirmText: '重新输入', closeOnMaskClick: true });
      } else if (!values.code) {
        return Message.warningDialog({ content: '请输入验证码!', confirmText: '重新输入', closeOnMaskClick: true });
      }
      run({ data: values });
    });
  };

  return <div className={style.login}>
    <div className={style.formDiv}>
      <div style={{ textAlign: 'center' }} className={style.logo}>
        {state.loginLogo && <img src={state.loginLogo} width='87' height={87} alt='' />}
      </div>
      <div className={style.enterpriseName}>
        {process.env.welcome}
        <span>首次登录请输入手机号进行绑定</span>
      </div>
      <div className={style.form}>
        <FormProvider form={form}>
          <Field name='phone' component={[Phone]} />
          <Field name='code' component={[Code]} />
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
      <div className={style.technical}>
        本系统由<a>道昕网络</a>提供技术支持
      </div>
    </div>
  </div>;
};

export default Sms;
