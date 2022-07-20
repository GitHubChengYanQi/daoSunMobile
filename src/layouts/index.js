import React, { useEffect } from 'react';
import { history, useModel } from 'umi';
import { connect } from 'dva';
import { ErrorBlock } from 'antd-mobile';
import styles from './index.less';
import { MyLoading } from '../pages/components/MyLoading';
import { loginBycode, wxUrl } from '../components/Auth';
import GetUserInfo from '../pages/GetUserInfo';
import { ToolUtil } from '../pages/components/ToolUtil';
import { Message } from '../pages/components/Message';
import MyError from '../pages/components/MyError';


const BasicLayout = (props) => {


  const { initialState, loading } = useModel('@@initialState');

  const state = initialState || {};

  window.scrollTo(0, 0);

  const receive = () => {
    window.receive = (code) => {
      const search = new URLSearchParams(code.split('?')[1]);
      const id = search.get('id');
      let codeId = '';
      if (id && id.length === 19) {
        codeId = id;
      } else if (code && code.length === 19) {
        codeId = code;
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

  const qrCodeAction = () => {
    let action = '';
    switch (history.location.pathname) {
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
  };


  setInterval(() => {
    if (GetUserInfo().token && ToolUtil.queryString('wxLogin', history.location.pathname)) {
      window.location.href = wxUrl(false);
    }
  }, 1000);

  useEffect(() => {
    if (!GetUserInfo().token) {
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
    return <div className={styles.safeArea}>
      {props.children}
    </div>;
  } else {
    return <div>
      <MyError title='系统初始化失败' />
    </div>;
  }


};

export default connect(({ qrCode }) => ({ qrCode }))(BasicLayout);
