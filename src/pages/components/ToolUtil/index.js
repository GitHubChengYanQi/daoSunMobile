import pako from 'pako';

// 判断是否是企业微信或者微信开发者工具
const isQiyeWeixin = () => {
  const ua = window.navigator.userAgent.toLowerCase();
  return ua.indexOf('wechatdevtools') !== -1 || ua.indexOf('wxwork') !== -1;
};

// 查找字符串返回 true / false
const queryString = (value, string) => {
  const patt = new RegExp(value, 'i');
  return patt.test(string);
};

// 返回空对象
const isObject = (object) => {
  return object || {};
};

// 返回空集合
const isArray = (array) => {
  return array || [];
};

// base64解压返回JSON对象
const unzip = (base64) => {
  const strData = atob(base64);
  // Convert binary string to character-number array
  const charData = strData.split('').map(function(x) {
    return x.charCodeAt(0);
  });
  // Turn number array into byte-array
  var binData = new Uint8Array(charData);
  // // unzip
  var data = pako.inflate(binData, { to: 'string' });
  return JSON.parse(data);
};

// 返回多个className
const classNames = (...props) => {

  if (!Array.isArray(props)) {
    return '';
  }
  return props.join(' ');
};

export const ToolUtil = {
  queryString,
  isObject,
  isArray,
  unzip,
  isQiyeWeixin,
  classNames,
};
