import pako from 'pako';
import { getLastMeasureIndex } from '../MentionsNote/LastMention';
import { MyDate } from '../MyDate';
import { Message } from '../Message';
import { history } from 'umi';

// 判断是否是企业微信或者微信开发者工具
const isQiyeWeixin = () => {
  const ua = window.navigator.userAgent.toLowerCase();
  return ua.indexOf('wechatdevtools') !== -1 || ua.indexOf('wxwork') !== -1;
};

// 查找字符串返回 true / false
const queryString = (value='', string) => {
  if (value.includes('\\')){
    value = value.replaceAll('\\','|');
  }
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
  const classNames = props.filter(item => item);
  return classNames.join(' ');
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
    transitionStart = () => {
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
    transitionStart();
    const { top, left } = getNodePosition();
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
  const mm = 1000;//1000毫秒 代表1秒
  const minute = mm * 60;
  const hour = minute * 60;
  const day = hour * 24;
  let ansTimeDifference = 0;//记录时间差
  const tmpTimeStamp = tmpTime ? Date.parse(tmpTime.replace(/-/gi, '/')) : new Date().getTime();//将 yyyy-mm-dd H:m:s 进行正则匹配
  const nowTime = new Date().getTime();//获取当前时间戳
  const tmpTimeDifference = nowTime - tmpTimeStamp;//计算当前与需要计算的时间的时间戳的差值
  if (tmpTimeDifference < 0) {//时间超出，不能计算
    return '刚刚';
  }
  const DifferebceDay = tmpTimeDifference / day;//进行天取整
  const DifferebceHour = tmpTimeDifference / hour;//进行小时取整
  const DifferebceMinute = tmpTimeDifference / minute;//进行分钟取整
  if (DifferebceDay > 2) {
    return MyDate.Show(tmpTime); //大于一个月 直接返回时间
  } else if (DifferebceDay >= 1) {
    ansTimeDifference = parseInt(DifferebceDay) + '天前';
  } else if (DifferebceHour >= 1) {
    ansTimeDifference = parseInt(DifferebceHour) + '小时前';
  } else if (DifferebceMinute >= 1) {
    ansTimeDifference = parseInt(DifferebceMinute) + '分钟前';
  } else {
    ansTimeDifference = '刚刚';
  }
  return ansTimeDifference;
};

// 监听浏览器后退事件
const back = (
  {
    title,
    key,
    onBack = () => {
    },
    disabled,
    onOk = () => {
    },
  }) => {

  const winHistory = window.history || {};
  const query = history.location.query || {};
  const search = Object.keys(query).map(item => (`${item}=${query[item]}`)).join('&');
  const url = '#' + history.location.pathname + '?' + search;
  if (!disabled) {
    winHistory.replaceState({ key }, title, url);
    winHistory.pushState({ title: key }, title, url);
  }

  window.onpopstate = (event) => {
    const state = event.state || {};
    console.log(state);
    if (state.key) {
      if (['spus'].includes(state.key)) {
        onBack();
        return;
      }
      Message.warningDialog({
        only: false,
        content: title || '是否退出当前页面？',
        onConfirm: () => {
          onOk();
          history.goBack();
        },
        onCancel: () => {
          winHistory.replaceState({ key }, title, url);
          winHistory.pushState({ title: key }, title, url);
        },
      });
    }
  };
};

// 最大显示宽度
const viewWidth = () => {
  return window.innerWidth > 640 ? 640 : window.innerWidth;
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
  timeDifference,
  back,
  viewWidth,
};
