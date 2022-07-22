import cookie from 'js-cookie';
import axios from 'axios';

const baseURI = process.env.ENV === 'test' ?
  // getHeader() ?
  // 'http://192.168.1.230'
  // :
  // 'https://lqscyq.xicp.fun'
  'http://192.168.1.229'
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
  return response;
}, (error) => {
  throw new Error(error);
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
