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
    className,
    svg,
  }) => {


  return <div className={ToolUtil.classNames(style.bottom, square && style.square, className)}>
    {only ?
      <Button
        loading={loading}
        disabled={disabled}
        className={style.button}
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
          {svg && <svg viewBox='0 0 30 30' className={style.leftCorner}>
            <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
              <path
                d='M30,0 C13.4314575,3.04359188e-15 -2.02906125e-15,13.4314575 0,30 L0,30 L0,0 Z'
                fill='var(--adm-color-white)'
                transform='translate(15.000000, 15.000000) scale(-1, -1) translate(-15.000000, -15.000000) ' />
            </g>
          </svg>}
          {rightText || '确认'}
        </Button>
      </>}
  </div>;
};

export default BottomButton;
