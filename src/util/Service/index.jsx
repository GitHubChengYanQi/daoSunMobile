import cookie from 'js-cookie';
import axios from 'axios';
import { Dialog } from 'antd-mobile';
import { getHeader } from '../../pages/components/GetHeader';

const baseURI = process.env.ENV === 'test' ?
  'https://api.hh.gf2025.com'
  :
  process.env.api;

const ajaxService = axios.create({
  baseURL: baseURI,
  withCredentials: true,
  headers: {
    // 'Content-Type':'application/json;charset=UTF-8',
  },
});

ajaxService.interceptors.request.use((config) => {
  const token = cookie.get('cheng-token');
  config.headers.common.Authorization = token || '';
  return config;
}, (error) => {
  return error;
});

ajaxService.interceptors.response.use((response) => {
  if (response.status !== 200) {
    throw new Error('网络错误');
  }
  response = response.data;
  const errCode = typeof response.errCode !== 'undefined' ? parseInt(response.errCode, 0) : 0;
  if (errCode !== 0) {
    if (errCode === 1502) {
      Dialog.confirm({
        title: '提示',
        content: '您已登录超时，请重新登录。',
        confirmText: '重新登录',
        onConfirm: async () => {
          cookie.remove('cheng-token');
          if (process.env.NODE_ENV === 'development') {
            const res = await request(
              {
                url: '/login/wxCp',
                method: 'POST',
                data: {
                  username: 'cheng',
                  password: '2683941980',
                },
              },
            );
            if (res.data) {
              await cookie.set('cheng-token', res.data);
            }
          }
          window.location.reload();
        },
      });
      throw new Error(response.message);
    } else if (response.message.indexOf('JSON') !== -1) {
      Dialog.alert({
        content: '输入格式错误！！！',
      });
    } else if (response.errCode === 402) {
      Dialog.confirm({
        title: '提示',
        content: '认证失败！，请重新登录。',
        confirmText: '重新登录',
        onConfirm: () => {
          try {
            // GotoLogin();
            cookie.remove('cheng-token');
            window.location.reload();
          } catch (e) {
            window.location.href = `/#/login?backUrl=${encodeURIComponent(window.location.href)}`;
          }
        },
      });
    } else if (response.errCode !== 200) {
      Dialog.alert({
        content: response.message,
      });
    }
    throw new Error(response.message);
  }
  return response;
}, (error) => {
  // if (error.errCode !== 0) {
  throw new Error(error.message);
  // }
  // return error;
});

const requestService = () => {
  return {
    ajaxService,
  };
};

export const request = ajaxService;
export default requestService;
