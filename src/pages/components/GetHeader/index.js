import { Dialog } from 'antd-mobile';

export const getHeader = () => {
  const ua = window.navigator.userAgent.toLowerCase();
  return ua.indexOf('wechatdevtools') !== -1 || ua.indexOf('wxwork') !== -1 || ua.indexOf('applewebkit') !== -1
};
