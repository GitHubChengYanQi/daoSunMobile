import React, { useEffect } from 'react';
import { history, useModel } from 'umi';
import { connect } from 'dva';
import { Dialog, ErrorBlock } from 'antd-mobile';
import styles from './index.less';
import { MyLoading } from '../pages/components/MyLoading';
import { loginBycode } from '../components/Auth';
import GetUserInfo from '../pages/GetUserInfo';
import { isQiyeWeixin } from '../pages/components/GetHeader';


const BasicLayout = (props) => {


  const { initialState, loading, refresh } = useModel('@@initialState');

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
        Dialog.alert({
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

  useEffect(() => {
    qrCodeAction();
    console.log(history.location.pathname);
    if (!GetUserInfo().token) {
      if (history.location.pathname === '/Login' || history.location.pathname === '/Sms'){
        return;
      }
      if (isQiyeWeixin()) {
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
    return (
      <div className={styles.safeArea}>
        {props.children}
      </div>
    );
  } else {
    return <div>
      <ErrorBlock fullPage title='系统初始化失败' />
    </div>;
  }


};

export default connect(({ qrCode }) => ({ qrCode }))(BasicLayout);
