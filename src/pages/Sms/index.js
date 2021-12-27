import { Button, Card, List } from 'antd-mobile';
import { useRequest } from '../../util/Request';
import React, { useState } from 'react';
import { Input } from 'weui-react-v2';
import { history } from 'umi';
import cookie from 'js-cookie';
import GetUserInfo from '../GetUserInfo';
import SendCode from '@jiumao/rc-send-code';


const Sms = () => {

  const { run } = useRequest({ url: '/sms/sendCode', method: 'POST' }, { manual: true });

  const { run: login } = useRequest({ url: '/login/phone', method: 'POST' }, {
    manual: true, onSuccess: (res) => {
      if (res) {
        cookie.set('cheng-token', res);
        const userInfo = GetUserInfo().userInfo;
        if (userInfo && userInfo.userId){
          history.push('/Login');
        }
      }
    },
  });

  const [sms, setSms] = useState({});

  return (
    <Card title='首次登录请输入手机号'>
      <List
        style={{
          '--prefix-width': '6em',
        }}
      >
        <List.Item prefix='手机号'>
          <Input placeholder='请输入手机号' clearable onChange={(value) => {
            setSms({ ...sms, phone: value });
          }} />
        </List.Item>
        <List.Item prefix='短信验证码' extra={
          <SendCode
            onCaptcha={() => {
              run(
                {
                  data: {
                    phone: sms && sms.phone,
                  },
                },
              );
              return true;
            }}
          />}>
          <Input placeholder='请输入验证码' clearable onChange={(value) => {
            setSms({ ...sms, code: value });
          }} />
        </List.Item>
        <List.Item>
          <Button color='primary' style={{ width: '100%' }} onClick={() => {
            login({
              data: {
                ...sms,
              },
            });
          }}>登录</Button>
        </List.Item>
      </List>
    </Card>
  );
};

export default Sms;
