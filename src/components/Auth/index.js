import React, { useEffect } from 'react';
import { useRequest } from '../../util/Request';
import cookie from 'js-cookie';
import GetUserInfo from '../../pages/GetUserInfo';
import { useDebounceEffect } from 'ahooks';
import { useState } from 'react';
import { Skeleton } from 'weui-react-v2';
import Login from '../../pages/Login';
import Sms from '../../pages/Sms';
import wx from 'populee-weixin-js-sdk';
import { getHeader } from '../../pages/components/GetHeader';
import { connect } from 'dva';
import { useLocation } from 'umi';
import {
  Dialog,
  Toast,
} from 'antd-mobile';
import IsDev from '../IsDev';

const Auth = (props) => {

  // https://dasheng-soft.picp.vip

  const [isLogin, setIsLogin] = useState(true);

  const location = useLocation();

  const userInfo = GetUserInfo().userInfo;

  const type = userInfo && userInfo.hasOwnProperty('type');

  const Url = () => {
    const search = new URLSearchParams(window.location.search);
    search.delete('code');
    search.delete('state');
    return window.location.protocol + '//' + window.location.host + window.location.pathname + search.toString() + window.location.hash;
  };

  const { run: runCode } = useRequest({
    url: '/login/oauth/wxCp',
    method: 'GET',
  }, { manual: true });

  const { run: runToken, loading } = useRequest({
    url: '/login/cp/loginByCode',
    method: 'GET',
  }, { manual: true });

  const loginBycode = async () => {
    const search = new URLSearchParams(window.location.search);
    const code = search.get('code');
    if (code) {
      const token = await runToken({
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


  const login = async () => {
    const data = await runCode({
      params: {
        url: Url(),
      },
    });
    window.location.href = data && data.url;
  };

  const token = GetUserInfo().token;

  const { run: wxTicket } = useRequest({
    url: '/api/ticket',
    method: 'GET',
  }, {
    manual: true,
    onSuccess: (res) => {
      wx.config({
        beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
        // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: res.appId, // 必填，企业微信的corpID
        timestamp: res.timestamp, // 必填，生成签名的时间戳
        nonceStr: res.nonceStr, // 必填，生成签名的随机串
        signature: res.signature,// 必填，签名，见 附录-JS-SDK使用权限签名算法
        jsApiList: ['ready', 'getLocation', 'scanQRCode', 'onHistoryBack'], // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
      });
    },
  });

  useDebounceEffect(() => {

    let action = '';
    switch (location.pathname) {
      case '/Scan/InStock/AppInstock':
        action = 'instock';
        break;
      case '/Scan/OutStock/AppOutstock':
        action = 'outstock';
        break;
      case '/Scan/InStock/FreeInstock':
        action = 'freeInstock';
        break;
      case '/Scan/OutStock/FreeOutstock':
        action = 'freeOutstock';
        break;
      case '/Scan/Inventory':
        action = 'inventory';
        break;
      case '/Work/Quality':
        action = 'quality';
        break;
      default:
        break;
    }
    props.dispatch({
      type: 'qrCode/scanCodeState',
      payload: {
        action,
      },
    });
    if (props.qrCode && props.qrCode.codeId) {
      props.dispatch({
        type: 'qrCode/clearCode',
      });
    }
  }, [
    location.pathname,
  ], {
    wait: 0,
  });


  useEffect(() => {
    if (!IsDev() && getHeader()) {
      wxTicket({
        params: {
          url: window.location.protocol + '//' + window.location.host + window.location.pathname,
        },
      });
    }
    window.receive = (code) => {
      let codeId = '';
      if (code.indexOf('wx.daoxin.gf2025.com/cp') !== -1 || code.indexOf('wx.hh.gf2025.com/cp') !== -1) {
        const param = code.split('=');
        if (param && param[1]) {
          codeId = param[1];
        } else {
          Toast.show({
            content: '请扫正确的码！',
          });
        }
      } else {
        if (code.length === 19) {
          codeId = code;
        } else {
          Dialog.alert({
            content: '请扫正确二维码！',
          });
        }

      }
      if (codeId !== '') {
        props.dispatch({
          type: 'qrCode/appAction',
          payload: {
            code: codeId,
          },
        });
      } else {
        Dialog.alert({
          content: '请扫正确二维码！',
        });
      }
    };
  }, [])

  useEffect(() => {
    setIsLogin(token);
    if (!token && getHeader() && process.env.NODE_ENV !== 'development') {
      loginBycode();
    }
  }, [token]);


  if (loading) {
    return <Skeleton loading />;
  }
  // if (process.env.NODE_ENV === 'development')
  //   return <>
  //     <Button onClick={() => {
  //       // const code = '1486169638786392066' // sku 单
  //       //  const code = '1486169788325912578' // sku 批
  //       // const code = '1485405524538183681'; // 库位
  //       const code = '1490853135920771074'; // 实物
  //       // const code = '1474546242691313666'; //入库
  //       props.dispatch({
  //         type: 'qrCode/appAction',
  //         payload: {
  //           code,
  //         },
  //       });
  //     }}>扫码</Button>
  //     {
  //       isLogin ? (type ? (userInfo.userId ? <Login /> : <Sms />) : props.children) : <Login />
  //     }
  //   </>;
  // else
  if (isLogin) {
    if (getHeader() && type) {
      return (userInfo && userInfo.userId) ? <Login /> : <Sms />;
    }
    if (!props.userInfo){
      props.dispatch({
        type: 'userInfo/getUserInfo',
      });
    }
    return props.children;
  } else {
    return <Login />;
  }

};

export default connect(({ qrCode,userInfo }) => ({ qrCode,userInfo }))(Auth);
