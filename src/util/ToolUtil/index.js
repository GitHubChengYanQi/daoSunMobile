import pako from 'pako';
import { getLastMeasureIndex } from '../../pages/components/MentionsNote/LastMention';
import { MyDate } from '../../pages/components/MyDate';
import { Message } from '../../pages/components/Message';
import { history } from 'umi';
import moment from 'moment';

// 判断是否是企业微信或者微信开发者工具
export const isQiyeWeixin = () => {
  const ua = window.navigator.userAgent.toLowerCase();
  return ua.indexOf('wechatdevtools') !== -1 || ua.indexOf('wxwork') !== -1;
};

// 查找字符串返回 true / false
export const queryString = (value = '', string) => {
  if (value.includes('\\')) {
    value = value.replaceAll('\\', '|');
  }
  const patt = new RegExp(value, 'i');
  return patt.test(string);
};

// 返回空对象
export const isObject = (object) => {
  return (object && typeof object === 'object') ? object : {};
};

// 返回空集合
export const isArray = (array) => {
  return Array.isArray(array) ? array : [];
};

// 集合去重
export const ArrayDuplicate = (array, key) => {
  const res = new Map();
  return (Array.isArray(array) ? array : []).filter((a) => !res.has(a[key]) && res.set(a[key], 1));
};

// base64解压返回JSON对象
export const unzip = (base64) => {
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
export const classNames = (...props) => {

  if (!Array.isArray(props)) {
    return '';
  }
  const classNames = props.filter(item => item);
  return classNames.join(' ');
};

// 监听键盘按下@事件
export const listenOnKeyUp = (
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
export const createBall = (
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
export const timeDifference = (tmpTime) => {
  const mm = 1000;//1000毫秒 代表1秒
  const minute = mm * 60;
  const hour = minute * 60;
  let ansTimeDifference = 0;//记录时间差
  const tmpTimeStamp = tmpTime ? Date.parse(tmpTime.replace(/-/gi, '/')) : new Date().getTime();//将 yyyy-mm-dd H:m:s 进行正则匹配
  const nowTime = new Date().getTime();//获取当前时间戳
  const tmpTimeDifference = nowTime - tmpTimeStamp;//计算当前与需要计算的时间的时间戳的差值
  if (tmpTimeDifference < 0) {//时间超出，不能计算
    return '刚刚';
  }

  const twoDayTime = new Date().setDate(moment().date() - 2);
  const DifferebceDay = moment().date() - moment(tmpTime).date();
  const DifferebceHour = tmpTimeDifference / hour;//进行小时取整
  const DifferebceMinute = tmpTimeDifference / minute;//进行分钟取整

  if (moment(tmpTime).isBefore(moment(twoDayTime), 'day')) {
    ansTimeDifference = MyDate.Show(tmpTime);
  } else if (DifferebceDay === 2) {
    ansTimeDifference = '前天 ' + moment(tmpTime).format('HH:mm');
  } else if (DifferebceDay === 1) {
    ansTimeDifference = '昨天 ' + moment(tmpTime).format('HH:mm');
  } else if (DifferebceHour >= 3) {
    ansTimeDifference = moment(tmpTime).format('HH:mm');
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
export const back = (
  {
    title,
    key,
    onBack = () => {
    },
    disabled,
    onOk = () => {
    },
    getContainer,
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
    if (state.key) {
      if (['popup'].includes(state.key)) {
        onBack();
        return;
      }
      Message.warningDialog({
        getContainer,
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
export const viewWidth = () => {
  return window.innerWidth > 640 ? 640 : window.innerWidth;
};

const decNum = (a) => {/*获取小数位数*/
  var r = 0;
  if (a !== null && a !== undefined) {
    a = a.toString();
    if (a.indexOf('.') !== -1) r = a.split('.')[1].length;
  }
  return r;
};

const int = (a) => {/*去除小数点并转成数值*/
  if (a !== null && a !== undefined) {
    if (Number(a) === 0) {
      return parseInt('0');
    } else {
      return parseInt(a.toString().replace('.', ''));
    }
  } else {
    return parseInt('0');
  }
};

// 数学四则运算
export const MathCalc = (a, b, type, decimal = 2) => {//加减乘除
  let r;
  let da = decNum(a);
  let db = decNum(b);
  let dsum = da + db;
  let dmin = Math.min(da, db);
  let dmax = Math.max(da, db);
  dsum += dmax - dmin;
  dsum = Math.pow(10, dsum);
  dmax = Math.pow(10, dmax);
  a = int(a);
  b = int(b);
  if (da > db) {
    b *= Math.pow(10, da - db);
  } else {
    a *= Math.pow(10, db - da);
  }

  switch (type) {
    case 'jia':
      r = (a + b) / dmax;
      break;
    case 'jian':
      r = (a - b) / dmax;
      break;
    case 'cheng':
      r = (a * b) / dsum;
      break;
    case 'chu':
      if (b === 0) {
        break;
      }
      r = a / b;
      break;
  }
  return Number(r.toFixed(decimal));
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
