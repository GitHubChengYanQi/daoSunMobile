import 'antd/dist/antd.css';
import GetUserInfo from './pages/GetUserInfo';
import { history } from 'umi';
import { getUserInfo, goToLogin, loginBycode,  wxTicket } from './components/Auth';
import cookie from 'js-cookie';
import { request } from './util/Request';
import IsDev from './components/IsDev';
import VConsole from 'vconsole';
import { ToolUtil } from './pages/components/ToolUtil';

export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      // console.error(err.message);
    },
  },
};


export async function getInitialState() {
  // new VConsole();
  const token = GetUserInfo().token;

  const userInfo = GetUserInfo().userInfo || {};
  const type = userInfo.hasOwnProperty('type');

  if (token && !type) {
    const res = await request({ url: '/rest/refreshToken', method: 'GET' });
    if (res) {
      cookie.set('cheng-token', res);
    } else {
      return { init: false };
    }
  }
  const publicInfo = await request({ url: '/getPublicInfo', method: 'GET' });

  if (!publicInfo) {
    return { init: false };
  }
  if (!token) {
    // token不存在
    if (ToolUtil.isQiyeWeixin() && !IsDev()) {
      // 是企业微信走byCode
      loginBycode();
      return { isQiYeWeiXin: true };
    } else {
      // 不是企业微信直接走login
      goToLogin();
      return { ...publicInfo, init: true };
    }
  } else {
    // token存在
    if (ToolUtil.isQiyeWeixin() && type) {
      // 是企业微信登录并且type存在
      if (userInfo.userId) {
        goToLogin();
      } else {
        history.push('/Sms');
      }
      return { ...publicInfo, init: true };
    } else {

      await wxTicket();
      const userInfo = await getUserInfo();

      // type不存在
      if (!IsDev() && userInfo.name === '程彦祺') {
        new VConsole();
      }

      const location = history.location || {};
      const query = location.query || {};
      if (query.backUrl) {
        window.location.href = query.backUrl;
      } else if (ToolUtil.queryString('login',location.pathname)) {
        history.push('/');
      }

      return {
        ...publicInfo,
        init: true,
        userInfo,
      };
    }
  }
}
