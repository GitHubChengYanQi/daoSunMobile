import React from 'react';
import { NavBar } from 'antd-mobile';
import { history } from 'umi';
import { getHeader } from '../GetHeader';

const MyNavBar = ({ title }) => {

  return !getHeader() && <div style={{height:45,position:'sticky',top:0,zIndex:999}}>
    <NavBar style={{
      '--border-bottom': '1px #eee solid',
      backgroundColor: '#fff',
    }} onBack={() => {
      history.goBack();
    }}>{title || '标题'}</NavBar>
  </div>;
};

export default MyNavBar;
