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

// 计算时间差
const timeDifference = (tmpTime) => {
  var mm=1000;//1000毫秒 代表1秒
  var minute = mm * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var month = day * 30;
  var ansTimeDifference=0;//记录时间差
  var tmpTimeStamp = tmpTime ? Date.parse(tmpTime.replace(/-/gi, "/")) : new Date().getTime();//将 yyyy-mm-dd H:m:s 进行正则匹配
  var nowTime = new Date().getTime();//获取当前时间戳
  var tmpTimeDifference = nowTime - tmpTimeStamp;//计算当前与需要计算的时间的时间戳的差值
  if (tmpTimeDifference < 0) {//时间超出，不能计算
    return '刚刚';
  }
  var DifferebceMonth = tmpTimeDifference / month; //进行月份取整
  var DifferebceWeek = tmpTimeDifference / (7 * day);//进行周取整
  var DifferebceDay = tmpTimeDifference / day;//进行天取整
  var DifferebceHour = tmpTimeDifference / hour;//进行小时取整
  var DifferebceMinute = tmpTimeDifference / minute;//进行分钟取整
  if (DifferebceMonth >= 1) {
    return tmpTime; //大于一个月 直接返回时间
  } else if (DifferebceWeek >= 1) {
    ansTimeDifference= parseInt(DifferebceWeek) + "个星期前";
  } else if (DifferebceDay >= 1) {
    ansTimeDifference = parseInt(DifferebceDay) + "天前";
  } else if (DifferebceHour >= 1) {
    ansTimeDifference = parseInt(DifferebceHour) + "小时前";
  } else if (DifferebceMinute >= 1) {
    ansTimeDifference = parseInt(DifferebceMinute) + "分钟前";
  } else {
    ansTimeDifference = "刚刚";
  }
  return ansTimeDifference;
}


export const ToolUtil = {
  queryString,
  isObject,
  isArray,
  unzip,
  isQiyeWeixin,
  classNames,
  listenOnKeyUp,
  createBall,
  timeDifference,
};
