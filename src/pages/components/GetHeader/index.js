export const getHeader = () => {
  const ua = window.navigator.userAgent.toLowerCase();
  return ua.indexOf('wechatdevtools') !== -1 || ua.indexOf('wxwork') !== -1
};

export const getModels = () => {
  const ua = window.navigator.userAgent.toLowerCase();
  return ua.indexOf('iphone') !== -1
};
