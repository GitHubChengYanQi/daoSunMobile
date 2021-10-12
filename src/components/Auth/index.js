import { useEffect } from 'react';
import { useRequest } from '../../util/Request';
import cookie from 'js-cookie';

const Auth = (props) => {

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

  useEffect(()=>{
    loginBycode();
  },[loginBycode])

  return props.children;
};

export default Auth;
