import React from 'react';
import { Dialog } from 'antd-mobile';
import style from './index.less';
import { Logo } from '../../Logo';

const MyDialog = ({ visible }) => {

  const Loading = () => {
    return <div className={style.loading}>
      <div className={style.loader}>
        <svg className={style.circular} viewBox='25 25 50 50'>
          <circle className={style.path} cx='50' cy='50' r='20' fill='none' strokeWidth='2' strokeMiterlimit='10' />
        </svg>
      </div>
      <div className={style.loadingLogo}>
        <img src={Logo().logo2} width={46} height={46} alt='' />
      </div>
    </div>;
  };

  return <Dialog
    visible={visible}
    content={
      <div style={{ textAlign: 'center' }}>
        {Loading()}
      </div>
    }
  />;
};

export default MyDialog;
