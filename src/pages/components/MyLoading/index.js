import { Dialog } from 'antd-mobile';
import style from './index.less';
import { Logo } from '../../Logo';
import React from 'react';

export const MyLoading = ({ skeleton }) => {

  const Loading = () => {
    return <div className={style.center}>
      <div className={style.loading}>
        <div className={style.loader}>
          <svg className={style.circular} viewBox='25 25 50 50'>
            <circle className={style.path} cx='50' cy='50' r='20' fill='none' strokeWidth='1' strokeMiterlimit='10' />
          </svg>
        </div>
        <div className={style.loadingLogo}>
          <img src={Logo().logo2} width={46} height={46} alt='' />
        </div>
      </div>
      <div className={style.center}>
        浑河工业
      </div>
      <div className={style.center}>
        HUNTS INDUSTRY
      </div>
    </div>;
  };

  if (skeleton) {
    return <div className={style.skeleton}>
      {Loading()}
    </div>;
  }


  return <Dialog
    className={style.dialog}
    visible
    style={{ zIndex: 10001 }}
    content={Loading()}
  />;
};
