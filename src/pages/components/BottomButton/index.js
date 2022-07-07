import React from 'react';
import { Button } from 'antd-mobile';
import style from './index.less';
import { ToolUtil } from '../ToolUtil';

const BottomButton = (
  {
    loading,
    color,
    leftText,
    leftDisabled,
    leftOnClick,
    rightText,
    rightOnClick,
    rightDisabled,
    only,
    disabled,
    onClick,
    text,
    square,
  }) => {


  return <div className={ToolUtil.classNames(style.bottom,square && style.square)}>
      {only ?
        <Button
          loading={loading}
          disabled={disabled}
          style={{ '--border-radius': '50px', width: '100%' }}
          color={color || 'primary'}
          onClick={() => {
            typeof onClick === 'function' && onClick();
          }}
        >{text || '确定'}</Button>
        :
        <>
          <Button
            color='primary'
            fill='outline'
            disabled={leftDisabled}
            className={style.left}
            onClick={() => {
              typeof leftOnClick === 'function' && leftOnClick();
            }}>
            {leftText || '取消'}
          </Button>
          <Button
            disabled={rightDisabled}
            className={style.right}
            color='primary'
            onClick={() => {
              typeof rightOnClick === 'function' && rightOnClick();
            }}>
            {rightText || '保存'}
          </Button>
        </>}
  </div>;
};

export default BottomButton;
