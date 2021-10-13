import cookie from 'js-cookie';
import axios from 'axios';
import {Modal} from 'antd';
import { Dialog } from 'antd-mobile';
import { router } from 'umi';

const baseURI =  'http://192.168.1.230';


const ajaxService = axios.create({
  baseURL: baseURI,
  withCredentials: true,
  headers: {
    // 'Content-Type':'application/json;charset=UTF-8',
  }
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
  const errCode = typeof response.errCode!=='undefined'?parseInt(response.errCode, 0):0;
  if (errCode !== 0) {
    if (errCode === 1502) {
      Modal.error({
        title: '提示',
        content: '您已登录超时，请重新登录。',
        okText: '重新登录',
        onOk: () => {
          Modal.destroyAll();
          try {
            // GotoLogin();
            router.push('/')
          } catch (e) {
            console.log('不能使用hook跳转');
            window.location.href = `/#/login?backUrl=${encodeURIComponent(window.location.href)}`;
          }
        }
      });
      throw new Error(response.message);
    }else if (response.errCode !== 200){
      Dialog.alert({
        content: response.message
      })
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
    ajaxService
  };
};

export const request = ajaxService;
export default requestService;
