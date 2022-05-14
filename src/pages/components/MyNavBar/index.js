import React, { useEffect } from 'react';
import { NavBar } from 'antd-mobile';
import { history, useModel } from 'umi';
import { isQiyeWeixin } from '../GetHeader';

const MyNavBar = ({ title }) => {

  const { initialState } = useModel('@@initialState');

  const state = initialState || {};

  useEffect(() => {
    window.document.title = state.systemName ? `${title}-${state.systemName}` : title;
  }, []);

  return !isQiyeWeixin() && <div style={{ height: 45, position: 'sticky', top: 0, zIndex: 999 }}>
    <NavBar style={{
      '--border-bottom': '1px #eee solid',
      backgroundColor: '#fff',
    }} onBack={() => {
      history.goBack();
    }}>{title || '标题'}</NavBar>
  </div>;
};

export default MyNavBar;
