import React from 'react';
import { Button, SafeArea } from 'antd-mobile';

const BottomButton = ({ leftText, leftOnClick, rightText, rightOnClick }) => {


  return <div
    style={{
      width: '100%',
      paddingBottom: 0,
      position: 'fixed',
      bottom: 0,
      backgroundColor: '#fff',
    }}>
    <div style={{ padding: '0 8px' }}>
      <Button
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
    </div>
    <div>
      <SafeArea position='bottom' />
    </div>
  </div>;
};

export default BottomButton;
