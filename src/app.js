import 'antd/dist/antd.css';
import GetUserInfo from './pages/GetUserInfo';
import { history } from 'umi';
import { getUserInfo, goToLogin, loginBycode, wxTicket } from './components/Auth';
import cookie from 'js-cookie';
import { request } from './util/Request';
import IsDev from './components/IsDev';
import VConsole from 'vconsole';
import { ToolUtil } from './util/ToolUtil';
import { Login } from 'MES-Apis/src/Login/promise';
import { Init } from 'MES-Apis/src/Init';

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
    Init.setToken(token);
    if (userInfo.userId) {
      const res = await Login.refreshToken({});
      if (res && res.data) {
        cookie.set('cheng-token', res.data);
      } else {
        return { init: false };
      }
    }
    // token存在
    if (ToolUtil.isQiyeWeixin() && !userInfo.userId) {
      // 是企业微信登录并且type存在
      if (userInfo.mobile) {
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
      } else if (ToolUtil.queryString('login', location.pathname)) {
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
