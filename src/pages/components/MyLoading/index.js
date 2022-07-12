import { Button, Dialog } from 'antd-mobile';
import style from './index.less';
import React, { useState } from 'react';
import { useModel } from 'umi';
import { useDebounceEffect } from 'ahooks';
import { ToolUtil } from '../ToolUtil';
import Icon from '../Icon';

export const MyLoading = (
  {
    skeleton,
    skeletonStyle,
    title,
    noLoadingTitle,
    loaderWidth,
    imgWidth = 46,
    downLoading,
    refresh,
  },
) => {

  const { initialState } = useModel('@@initialState');

  const state = initialState || {};

  const [loadingTitle, setLoadingTitle] = useState(title);

  const [error, setError] = useState();

  useDebounceEffect(() => {
    if (!noLoadingTitle) {
      setLoadingTitle('当前网速较慢，正在努力加载...');
    }
  }, [], {
    wait: 3000,
  });

  useDebounceEffect(() => {
    setError(true);
  }, [], {
    wait: 30000,
  });

  const Loading = () => {
    if (error) {
      return <div className={style.error}>
        <Icon type='icon-Wifi-Error' />
        <div>网络不给力</div>
        <Button
          color='danger'
          fill='outline'
          onClick={() => {
            if (typeof refresh === 'function') {
              return refresh();
            }
            window.location.reload();
          }}
        >
          重试
        </Button>
      </div>;
    }
    return <div className={ToolUtil.classNames(style.center, downLoading ? style.downLoading : '')}>
      <div className={style.loading}>
        <div className={style.loader} style={{ width: loaderWidth || 100 }}>
          <svg className={style.circular} viewBox='25 25 50 50'>
            <circle className={style.path} cx='50' cy='50' r='20' fill='none' strokeWidth='1' strokeMiterlimit='10' />
          </svg>
        </div>
        <div
          className={style.loadingLogo}
          style={{ top: `calc(50% - ${imgWidth / 2}px)`, left: `calc(50% - ${imgWidth / 2}px)` }}
        >
          {state.homeLogo && <img src={state.homeLogo} width={imgWidth} height={imgWidth} alt='' />}
        </div>
      </div>
      <div className={style.loadingTitle}>
        {loadingTitle || <div>
          <div>
            {state.enterpriseName}
          </div>
          <div>
            {state.englishName}
          </div>
        </div>}
      </div>
    </div>;
  };

  if (skeleton) {
    return <div className={style.skeleton} style={skeletonStyle}>
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
