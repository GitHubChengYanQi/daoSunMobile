import React, { useEffect } from 'react';
import { history, useModel } from 'umi';
import { connect } from 'dva';
import styles from './index.less';
import { MyLoading } from '../pages/components/MyLoading';
import { loginBycode, wxUrl } from '../components/Auth';
import GetUserInfo from '../pages/GetUserInfo';
import { ToolUtil } from '../pages/components/ToolUtil';
import { Message } from '../pages/components/Message';
import MyError from '../pages/components/MyError';
import { AliveScope } from '../components/KeepAlive';


const BasicLayout = (props) => {

  const { initialState, loading } = useModel('@@initialState');

  const state = initialState || {};

  window.scrollTo(0, 0);

  const receive = () => {
    window.receive = (codeInfo = '') => {
      const search = new URLSearchParams(codeInfo.split('?')[1]);
      const id = search.get('id') || '';
      const code = search.get('code');
      if (code) {
        window.location.href = codeInfo;
        return;
      }
      let codeId = '';
      if (id.length === 19) {
        codeId = id;
      } else if (codeInfo.length === 19) {
        codeId = codeInfo;
      } else {
        Message.warningDialog({
          content: '请扫正确二维码！',
        });
      }
      if (codeId !== '') {
        props.dispatch({
          type: 'qrCode/appAction',
          payload: {
            code: codeId,
          },
        });
      }
    };
  };

  const checkWxLogin = setInterval(() => {
    if (GetUserInfo().token && ToolUtil.queryString('wxLogin', history.location.pathname)) {
      window.location.href = wxUrl(false);
    }
  }, 1000);

  useEffect(() => {
    if (!GetUserInfo().token && state.init) {
      if (ToolUtil.queryString('Login', history.location.pathname) || ToolUtil.queryString('Sms', history.location.pathname)) {
        return;
      }
      if (ToolUtil.isQiyeWeixin()) {
        loginBycode();
      } else {
        history.push('/Login');
      }
    }
  }, [history.location.pathname]);

  useEffect(() => {
    receive();
  }, []);


  if (loading) {
    return <MyLoading skeleton title='正在初始化个人信息,请稍后...' />;
  }

  if (state.isQiYeWeiXin) {
    return <MyLoading skeleton title='企业微信登录中...' />;
  }

  if (state.init === true) {
    // clearInterval(checkWxLogin);
    return <AliveScope>
      <div className={styles.safeArea}>
        {props.children}
      </div>
    </AliveScope>;
  } else {
    return <div>
      <MyError title='系统初始化失败' />
    </div>;
  }


};

export default connect(({ qrCode }) => ({ qrCode }))(BasicLayout);
