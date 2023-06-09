import React from 'react';
import style from '../../../Login/index.less';
import Icon from '../../../components/Icon';
import { Dialog, Input, Toast } from 'antd-mobile';
import { useRequest } from '../../../../util/Request';
import SendCode from '@jiumao/rc-send-code';
import { PhoneOutlined } from '@ant-design/icons';
import { Message } from '../../../components/Message';

export const Phone = (props) => {

  return <div className={style.account}>
    <PhoneOutlined style={{color:'var(--adm-color-primary)'}} />
    <Input
      className={style.accountInput}
      placeholder='请输入手机号'
      {...props}
    />
  </div>;
};

export const Code = ({ phone, ...props }) => {

  const { run } = useRequest({ url: '/sms/sendCode', method: 'POST' }, {
    manual: true,
    onSuccess: () => {
      Toast.show({ content: '验证码已发送!' });
    },
  });

  return <div className={style.account}>
    <Icon type='icon-yanzhengma' />
    <Input
      className={style.accountInput}
      placeholder='请输入验证码'
      {...props}
    />
    <SendCode
      disabled={!phone}
      className={style.sendCode}
      onCaptcha={() => {
        if (!phone) {
          Message.warningDialog({ content: '请输入手机号!', confirmText: '重新输入', closeOnMaskClick: true });
          return new Promise((resolve, reject) => {
            return reject();
          });
        }
        return run(
          {
            data: {
              phone,
            },
          },
        );
      }}
    />
  </div>;
};
