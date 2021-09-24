import { useState } from 'react';
import { useRequest } from '../util/Request';

function BasicLayout(props) {

  let [isNotLogin, setIsNotLogin] = useState(true)

  const {run:refreshToken} = useRequest({
    url: "/login/refreshToken",
    method: "POST",
  }, {
    manual: true,
  },false);

  const {error, run} = useRequest({
    url: "/login/miniprogram/code2session",
    method: "POST",
  }, {
    onError(){
      /**
       * TODO 判断error 存在就显示登录失败的提示
       */
      console.log('登录失败');
      // Taro.hideLoading();
    },
    manual: true,
  });

  const {error: codeError, run: codeRun} = useRequest({
    url: "/login/oauth/wxMp",
    method: "GET",
  }, {
    manual: true,
  });

  const {error: tokenError, run: tokenRun} = useRequest({
    url: "/login/mp/loginByCode",
    method: "GET",
  }, {
    manual: true,
    onError: () => {
      // wxLogin();
    }
  });

  return (
    <div>
      {props.children}
    </div>
  );
}

export default BasicLayout;
