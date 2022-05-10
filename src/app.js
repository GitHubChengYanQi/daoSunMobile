import 'antd/dist/antd.css';
import GetUserInfo from './pages/GetUserInfo';
import { getHeader } from './pages/components/GetHeader';
import { history } from 'umi';
import { getUserInfo, loginBycode, wxTicket } from './components/Auth';
import cookie from 'js-cookie';
import { request } from './util/Request';

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

  const userInfo = GetUserInfo().userInfo || {};

  const type = userInfo.hasOwnProperty('type');

  if (!token && getHeader() && process.env.NODE_ENV !== 'development') {
    loginBycode();
  } else if (!token) {
    const res = await VerificationCodeOpen();
    history.push('/Login');
    return res.kaptchaOpen;
  } else if (getHeader() && type) {
    if (userInfo.userId) {
      const res = await VerificationCodeOpen();
      history.push('/Login');
      return res.kaptchaOpen;
    } else {
      history.push('/Sms');
    }
  } else {
    await wxTicket();
    const currentUrl = cookie.get('currentUrl');

    if (currentUrl) {
      history.replace(currentUrl.replace('#', ''));
    } else if (window.location.href.indexOf('Login') !== -1) {
      history.replace('/');
    }
    return await getUserInfo();
  }

  return {};
}
