import React from 'react';
import { NavBar } from 'antd-mobile';
import { history } from 'umi';
import { Affix } from 'antd';
import { getHeader } from '../GetHeader';

const MyNavBar = ({ title }) => {


  return !getHeader() && <Affix offsetTop={0}>
    <div>
      <NavBar style={{
      '--border-bottom': '1px #eee solid',
      backgroundColor: '#fff',
    }} onBack={() => {
      history.goBack();
    }}>{title || '标题'}</NavBar>
    </div>
  </Affix>;
};

export default MyNavBar;
