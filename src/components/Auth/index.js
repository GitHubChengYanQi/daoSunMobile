import { useRequest } from '../../util/Request';
import cookie from 'js-cookie';
import GetUserInfo from '../../pages/GetUserInfo';
import { useDebounceEffect } from 'ahooks';
import { useState } from 'react';
import { Skeleton } from 'weui-react-v2';
import Login from '../../pages/Login';
import Sms from '../../pages/Sms';

const Auth = (props) => {

  // http://ieonline.microsoft.com:8000/

  const [isLogin,setIsLogin] = useState();

  const [type,stType] = useState();

  const userInfo = GetUserInfo().userInfo;

  const Url = () => {
    const search = new URLSearchParams(window.location.search);
    search.delete('code');
    search.delete('state');
    const url = process.env.NODE_ENV === 'development' ? '/?' : '/cp/?';
    return window.location.protocol + '//' + window.location.host + url + search.toString() + window.location.hash;
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
