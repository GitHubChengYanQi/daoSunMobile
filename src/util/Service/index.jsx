import cookie from 'js-cookie';
import axios from 'axios';
import {Modal} from 'antd';
import { Dialog } from 'antd-mobile';
import { router } from 'umi';
import { Config } from '../../../config';

const baseURI =
  process.env.NODE_ENV === 'development'
    ?
    "http://192.168.1.119"
    // Config().api
    :
    Config().api
;



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
            cookie.remove('cheng-token');
            if (process.env.NODE_ENV === 'development'){
              router.push('/');
            }
            window.location.href = window.location.href+''
          } catch (e) {
            window.location.href = `/#/login?backUrl=${encodeURIComponent(window.location.href)}`;
          }
        }
      });
      throw new Error(response.message);
    }else if (response.message.indexOf('JSON') !== -1){
      Dialog.alert({
        content: '输入格式错误！！！'
      })
    }else if (response.errCode === 402){
      cookie.remove('cheng-token');
      Modal.error({
        title: '提示',
        content: '认证失败！，请重新登录。',
        okText: '重新登录',
        onOk: () => {
          Modal.destroyAll();
          try {
            // GotoLogin();
            cookie.remove('cheng-token');
            window.location.href = window.location.href+''
          } catch (e) {
            window.location.href = `/#/login?backUrl=${encodeURIComponent(window.location.href)}`;
          }
        }
      });
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
