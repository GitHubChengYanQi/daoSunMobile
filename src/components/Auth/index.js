import IsDev from '../IsDev';
import { getHeader } from '../../pages/components/GetHeader';
import { request } from '../../util/Request';
import wx from 'populee-weixin-js-sdk';
import cookie from 'js-cookie';


export const wxTicket = async () => {
  if (!IsDev() && getHeader()) {
    const url = (window.location.protocol + '//' + window.location.host + window.location.pathname).split('#');
    const res = await request({
      url: '/api/ticket',
      method: 'GET',
      params: {
        url: url[0],
      },
    });
    if (res) {
      wx.config({
        beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: res.appId, // 必填，企业微信的corpID
        timestamp: res.timestamp, // 必填，生成签名的时间戳
        nonceStr: res.nonceStr, // 必填，生成签名的随机串
        signature: res.signature,// 必填，签名，见 附录-JS-SDK使用权限签名算法
        jsApiList: ['ready', 'getLocation', 'scanQRCode', 'onHistoryBack', 'invoke'], // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
      });
    }
  }
};

const Url = () => {
  const search = new URLSearchParams(window.location.search);
  search.delete('code');
  search.delete('state');
  return window.location.protocol + '//' + window.location.host + window.location.pathname + search.toString() + window.location.hash;
};

const login = async () => {
  const data = await request({
    url: '/login/oauth/wxCp',
    method: 'GET',
    params: {
      url: Url(),
    },
  });
  window.location.href = data && data.url;
};

export const loginBycode = async () => {
  const search = new URLSearchParams(window.location.search);
  const code = search.get('code');
  if (code) {
    const token = await request({
      url: '/login/cp/loginByCode',
      method: 'GET',
      params: {
        code: code,
      },
    });
    if (token) {
      cookie.set('cheng-token', token);
      window.location.reload();
    } else {
      login();
    }
  } else {
    login();
  }
};

export const getUserInfo = async () => {
  const userInfo = await request(
    {
      url: '/rest/mgr/getMyInfo',
      method: 'POST',
    },
  );
  const customer = await request(
    {
      url: '/customer/detail',
      method: 'POST',
    },
  );

  return {
    ...userInfo,
    abbreviation: customer.abbreviation,
    customerName: customer.customerName,
    customerId: customer.customerId,
  };
};
