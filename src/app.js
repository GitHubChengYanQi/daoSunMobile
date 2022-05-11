import 'antd/dist/antd.css';
import GetUserInfo from './pages/GetUserInfo';
import { getHeader } from './pages/components/GetHeader';
import { history } from 'umi';
import { getUserInfo, loginBycode, wxTicket } from './components/Auth';
import cookie from 'js-cookie';
import { request } from './util/Request';
import * as VConsole from 'vconsole';

export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      console.error(err.message);
    },
  },
};

const VerificationCodeOpen = async () => {
  return await request({ url: '/getKaptchaOpen', method: 'GET' });
};

export async function getInitialState() {

  const token = GetUserInfo().token;

  if (token) {
    const res = await request({ url: '/rest/refreshToken', method: 'GET' });
    if (res) {
      cookie.set('cheng-token', res);
    }
  }

  const userInfo = GetUserInfo().userInfo || {};
  const type = userInfo.hasOwnProperty('type');

  const res = await VerificationCodeOpen();

  if (!token) {
    // token不存在
    if (getHeader() && process.env.NODE_ENV !== 'development') {
      // 是企业微信走byCode
      loginBycode();
    } else {
      // 不是企业微信直接走login
      history.push('/Login');
      return { kaptchaOpen: res.kaptchaOpen };
    }
  } else {
    // token存在
    if (getHeader() && type) {
      // 是企业微信登录并且type存在
      if (userInfo.userId) {
        const res = await VerificationCodeOpen();
        history.push('/Login');
        return { kaptchaOpen: res.kaptchaOpen };
      } else {
        history.push('/Sms');
      }
    } else {
      // type不存在
      await wxTicket();
      const currentUrl = cookie.get('currentUrl');

      if (currentUrl) {
        history.replace(currentUrl.replace('#', ''));
      } else if (window.location.href.indexOf('Login') !== -1) {
        history.replace('/');
      }
      return await getUserInfo();
    }
  }
  return {};
}
