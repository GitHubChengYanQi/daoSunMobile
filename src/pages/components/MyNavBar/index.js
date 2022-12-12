import React, { useEffect } from 'react';
import { NavBar } from 'antd-mobile';
import { history, useModel } from 'umi';
import { ToolUtil } from '../ToolUtil';
import { useLocation } from 'react-router-dom';

const MyNavBar = ({ title, noDom }) => {

  const { initialState } = useModel('@@initialState');

  const location = useLocation();

  const state = initialState || {};

  useEffect(() => {
    setTimeout(() => {
      document.title = state.systemName ? `${title}-${state.systemName}` : title;
    }, 0);
  }, [location.pathname, title]);

  if (noDom) {
    return <></>;
  }

  return !ToolUtil.isQiyeWeixin() ? <div style={{ height: 45, position: 'sticky', top: 0, zIndex: 999 }}>
    <NavBar style={{
      '--border-bottom': '1px #eee solid',
      backgroundColor: '#fff',
    }} onBack={() => {
      history.goBack();
    }}>{title || '标题'}</NavBar>
  </div> : <></>;
};

export default MyNavBar;
