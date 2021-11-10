import { useRequest } from '../../util/Request';
import cookie from 'js-cookie';
import GetUserInfo from '../../pages/GetUserInfo';
import { useDebounceEffect } from 'ahooks';
import { useState } from 'react';
import { Skeleton } from 'weui-react-v2';
import Login from '../../pages/Login';
import Sms from '../../pages/Sms';
import wx from 'populee-weixin-js-sdk';

const Auth = (props) => {

  // https://dasheng-soft.picp.vip


  const [isLogin,setIsLogin] = useState();

  const [type,stType] = useState();

  const userInfo = GetUserInfo().userInfo;

  const Url = () => {
    const search = new URLSearchParams(window.location.search);
    search.delete('code');
    search.delete('state');
    return window.location.protocol + '//' + window.location.host + window.location.pathname + search.toString() + window.location.hash;
  }

  const refreshType = () => {
    const type = userInfo && userInfo.hasOwnProperty('type')
    stType(type);
  }

  const {run:runCode} = useRequest({
    url:'/login/oauth/wxCp',
    method:'GET',
  },{manual:true});

  const {run:runToken} = useRequest({
    url:'/login/cp/loginByCode',
    method:'GET',
  },{manual:true});

  const loginBycode = async () => {
    const search = new URLSearchParams(window.location.search);
    const code = search.get('code');
    if (code) {
      const token = await runToken({
        params:{
          code:code
        }
      });
      if (token){
        refreshType();
        cookie.set('cheng-token', token);
        window.location.href =  Url();
      }else {
        login();
      }
    } else {
      login();
    }
  }


  const login = async () => {

    const data = await runCode({
      params:{
        url: Url()
      }
    });
    window.location.href = data && data.url
  }

  const token = GetUserInfo().token;

  const { data: jssdk } = useRequest({
    url: '/api/ticket',
    method: 'GET',
    params: {
      url: window.location.protocol + '//' + window.location.host + window.location.pathname,
    },
  }, {
    onSuccess: () => {
      wx.config({
        beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
        // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: jssdk.appId, // 必填，企业微信的corpID
        timestamp: jssdk.timestamp, // 必填，生成签名的时间戳
        nonceStr: jssdk.nonceStr, // 必填，生成签名的随机串
        signature: jssdk.signature,// 必填，签名，见 附录-JS-SDK使用权限签名算法
        jsApiList: ['ready', 'getLocation','scanQRCode'], // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
      });
    },
  });

  useDebounceEffect(()=>{
    setIsLogin(token);
    if (!token){
      loginBycode();
    }
    refreshType();
  },[token],{
    wait:0
  })



  return isLogin ? (type ? (userInfo.userId ? <Login /> : <Sms />) : props.children) : <Skeleton loading />  ;
};

export default Auth;
