import { Dialog } from 'antd-mobile';
import style from './index.less';
import React, { useState } from 'react';
import { useModel } from 'umi';
import { useDebounceEffect } from 'ahooks';

export const MyLoading = ({ skeleton, title }) => {

  const { initialState } = useModel('@@initialState');

  const state = initialState || {};

  const [loadingTitle, setLoadingTitle] = useState(title);

  // 当前网速较慢，正在努力加载...

  useDebounceEffect(() => {
    setLoadingTitle('当前网速较慢，正在努力加载...');
  }, [],{
    wait:3000,
  });

  // alert(333);

  const Loading = () => {
    return <div className={style.center}>
      <div className={style.loading}>
        <div className={style.loader}>
          <svg className={style.circular} viewBox='25 25 50 50'>
            <circle className={style.path} cx='50' cy='50' r='20' fill='none' strokeWidth='1' strokeMiterlimit='10' />
          </svg>
        </div>
        <div className={style.loadingLogo}>
          {state.homeLogo && <img src={state.homeLogo} width={46} height={46} alt='' />}
        </div>
      </div>
      <div className={style.loadingTitle}>
        {loadingTitle}
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
