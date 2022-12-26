import cookie from 'js-cookie';
import axios from 'axios';
import { Message } from '../../pages/components/Message';

console.log(process.env.ENV);
const baseURI = process.env.ENV === 'test' ?
  // getHeader() ?
  // 'http://192.168.1.230'
  // :
  // 'https://192.168.0.220:8891'
  // 'http://172.16.1.181'
  // 'http://10.147.20.68:8881/'
  'https://api.hh.gf2025.com'
  :
  'http://172.16.1.18'

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

export const errorAction = ({ options = {}, response, noError }) => {
  const errCode = typeof response.errCode !== 'undefined' ? parseInt(response.errCode, 0) : 0;
  if (![0, 1001].includes(errCode)) {
    if (errCode === 1502) {
      cookie.remove('cheng-token');
      window.location.reload();
    } else if (errCode !== 200 && !options.noError) {
      Message.errorDialog({
        content: response.message,
      });
    }
    if (!noError) {
      throw new Error(response.message);
    }
  }
};

export const request = async (config) => {
  return new Promise((resolve) => {
    ajaxService(config).then((response) => {
      errorAction({ response, noError: true });
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
