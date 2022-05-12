import React, { useEffect } from 'react';
import { useLocation } from 'umi';
import { connect } from 'dva';
import { Dialog } from 'antd-mobile';
import styles from './index.less';
import * as VConsole from 'vconsole';

// import * as VConsole from 'vconsole';

const BasicLayout = (props) => {

  // const console = new VConsole();

  window.scrollTo(0, 0);

  const location = useLocation();

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
  };

  useEffect(() => {
    receive();
    qrCodeAction();
    window.document.title = process.env.title
  }, [location.pathname]);

  return (
    // <Auth>
    <div className={styles.safeArea}>
      {props.children}
    </div>
    // </Auth>
  );
};

export default connect(({ qrCode }) => ({ qrCode }))(BasicLayout);
