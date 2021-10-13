import { Button, List } from 'antd-mobile';
import { useRequest } from '../../util/Request';
import { useState } from 'react';
import { Input } from 'weui-react-v2';
import { router } from 'umi';
import cookie from 'js-cookie';
import GetUserInfo from '../GetUserInfo';


const Sms = () => {

  const { run } = useRequest({ url: '/sms/sendCode', method: 'POST' }, { manual: true });

  const { run: login } = useRequest({ url: '/login/phone', method: 'POST' }, {
    manual: true, onSuccess: (res) => {
      if (res) {
        cookie.set('cheng-token', res);
        const userInfo = GetUserInfo().userInfo;
        if (userInfo && userInfo.userId){
          router.push('/Login');
        }
      }
    },
  });

  const [sms, setSms] = useState({});

  return (
    <>
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
        <List.Item prefix='短信验证码' extra={<Button color='primary' onClick={() => {
          run(
            {
              data: {
                phone: sms && sms.phone,
              },
            },
          );
        }} fill='none'>
          发送验证码
        </Button>}>
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
    </>
  );
};

export default Sms;
