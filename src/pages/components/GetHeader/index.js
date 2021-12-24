export const getHeader = () => {
  const ua = window.navigator.userAgent.toLowerCase();
  return ua.match(/wxwork/i) && (ua.match(/wxwork/i)[0] === 'wxwork')
    ||
    ua.match(/wechatdevtools/i) && (ua.match(/wechatdevtools/i)[0] === 'wechatdevtools');
};
