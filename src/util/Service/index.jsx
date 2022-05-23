import cookie from 'js-cookie';
import axios from 'axios';
import { Dialog } from 'antd-mobile';
import { goToLogin } from '../../components/Auth';
import { history } from 'umi';
import { ToolUtil } from '../../pages/components/ToolUtil';

const baseURI = process.env.ENV === 'test' ?
  // getHeader() ?
  // 'http://192.168.1.230'
  // :
  // 'https://lqscyq.xicp.fun'
  'http://192.168.1.230'
  // 'https://api.daoxin.gf2025.com'
  // 'https://api.hh.gf2025.com'
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
      cookie.remove('cheng-token');

      const backUrl = window.location.href;
      if (!ToolUtil.queryString('login', backUrl)) {
        history.push({
          pathname: '/Login',
          query: {
            backUrl,
          },
        });
      }
    } else if (response.errCode !== 200) {
      Dialog.alert({
        content: response.message,
        closeOnMaskClick: true,
        confirmText: '确认',
      });
    }
    throw new Error(response.message);
  }
  return response;
}, (error) => {
  // console.log(error.response);
  return error;
});

export const request = async (config) => {
  return new Promise((resolve) => {
    ajaxService(config).then((response) => {
      resolve(response);
    }).catch((e) => {
      resolve({
        errCode: 0,
        message: '系统错误，请联系管理员',
      });
    });
  });
};

const requestService = () => {
  return {
    request,
    ajaxService,
  };
};

export default requestService;
