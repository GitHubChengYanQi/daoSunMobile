import React from 'react';
import { Button, SafeArea } from 'antd-mobile';

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
  }) => {


  return <div
    style={{
      height: 60,
      zIndex: 999,
      width: '100%',
      paddingBottom: 0,
      position: 'fixed',
      bottom: 0,
      left: 0,
      backgroundColor: '#fff',
      boxShadow: '0px 4px 10px 0px rgba(0, 0, 0, 0.3)',
    }}>
    <div style={{ padding: '10px 12px' }}>
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
            style={{
              padding: '8px 0',
              fontSize: 14,
              width: '50%',
              borderRadius: 50,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              borderRight: 'none',
            }}
            onClick={() => {
              typeof leftOnClick === 'function' && leftOnClick();
            }}>
            {leftText || '取消'}
          </Button>
          <Button
            disabled={rightDisabled}
            style={{
              borderLeft: 'none',
              padding: '8px 0',
              fontSize: 14,
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
