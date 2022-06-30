import pako from 'pako';
import { getLastMeasureIndex } from '../MentionsNote/LastMention';

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
  return (object && typeof object === 'object') ? object : {};
};

// 返回空集合
const isArray = (array) => {
  return Array.isArray(array) ? array : [];
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
  return props.map(item => item || '').join(' ');
};

// 监听键盘按下@事件
const listenOnKeyUp = (
  {
    even,
    value = '',
    callBack = () => {
    },
  }) => {

  const { location: measureIndex, prefix: measurePrefix } = getLastMeasureIndex(
    value,
    '@',
  );

  if (measureIndex !== -1) {
    if (even.key === measurePrefix || even.key === 'Shift') {
      callBack();
    }
  }
};

// 动画
const createBall = (
  {
    top,
    left,
    imgUrl,
    transitionEnd = () => {
    },
    getNodePosition = () => {
    },
  },
) => {

  let i = 0;

  const bar = document.createElement('div');

  bar.style.backgroundImage = `url(${imgUrl})`;
  bar.style.backgroundColor = '#e1e1e1';
  bar.style.backgroundSize = 'cover';
  bar.style.border = 'solid #F1F1F1 1px';
  bar.style.borderRadius = '4px';
  bar.style.zIndex = '1001';
  bar.style.position = 'fixed';
  bar.style.display = 'block';
  bar.style.left = left + 'px';
  bar.style.top = top + 'px';
  bar.style.width = '50px';
  bar.style.height = '50px';
  bar.style.transition = 'left .6s linear, top .6s cubic-bezier(0.5, -0.5, 1, 1)';

  document.body.appendChild(bar);
  // 添加动画属性
  setTimeout(() => {
   const {top,left} = getNodePosition();
    bar.style.top = (top) + 'px';
    bar.style.left = (left) + 'px';
  }, 0);

  /**
   * 动画结束后，删除
   */
  bar.ontransitionend = () => {
    bar.remove();
    i++;
    if (i === 2) {
      transitionEnd();
    }

  };
};


export const ToolUtil = {
  queryString,
  isObject,
  isArray,
  unzip,
  isQiyeWeixin,
  classNames,
  listenOnKeyUp,
  createBall,
};
