import React from 'react';
import { NavBar } from 'antd-mobile';
import { history } from 'umi';
import { Affix } from 'antd';

const MyNavBar = ({title}) => {


  return <Affix offsetTop={0}><NavBar style={{
    '--border-bottom': '1px #eee solid',
    backgroundColor:'#fff'
  }} onBack={() => {
    history.goBack();
  }}>{title || '标题'}</NavBar></Affix>;
};

export default MyNavBar;
