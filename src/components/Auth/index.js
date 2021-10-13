import { useRequest } from '../../util/Request';
import cookie from 'js-cookie';
import GetUserInfo from '../../pages/GetUserInfo';
import { router } from 'umi';
import { useDebounceEffect } from 'ahooks';

const Auth = (props) => {

  // http://ieonline.microsoft.com:8000/

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
        cookie.set('cheng-token', token);
        router.push('/Home');
      }
    } else {
      login();
    }
  }


  const login = async () => {
    const search = new URLSearchParams(window.location.search);
    search.delete('code');
    search.delete('state');
    const data = await runCode({
      params:{
        url: window.location.protocol + '//' + window.location.host + '/?' + search.toString() + window.location.hash
      }
    });
    window.location.href = data && data.url
  }

  const token = GetUserInfo().token;

  useDebounceEffect(()=>{
    if (!token){
      loginBycode();
    }
  },[props],{
    wait:0
  })


  return props.children;
};

export default Auth;
