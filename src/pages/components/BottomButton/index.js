import React from 'react';
import { Button, SafeArea } from 'antd-mobile';

const BottomButton = (
  {
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
  }) => {


  return <div
    style={{
      width: '100%',
      paddingBottom: 0,
      position: 'fixed',
      bottom: 16,
      backgroundColor: '#fff',
    }}>
    <div style={{ padding: '0 8px' }}>
      {only ?
        <Button
          disabled={disabled}
          style={{ '--border-radius': '50px', width: '100%' }}
          color='primary'
          onClick={() => {
            typeof onClick === 'function' && onClick();
          }}
        >{text || '确定'}</Button>
        :
        <>
          <Button
            disabled={leftDisabled}
            style={{
              padding: 8,
              width: '50%',
              borderRadius: 50,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            }}
            onClick={() => {
              typeof leftOnClick === 'function' && leftOnClick();
            }}>
            {leftText || '取消'}
          </Button>
          <Button
            disabled={rightDisabled}
            style={{
              padding: 8,
              width: '50%',
              backgroundColor: '#4B8BF5',
              borderRadius: 50,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            }}
            color='primary'
            onClick={() => {
              typeof rightOnClick === 'function' && rightOnClick();
            }}>
            {rightText || '保存'}
          </Button>
        </>}
    </div>
    <SafeArea position='bottom' />
  </div>;
};

export default BottomButton;
