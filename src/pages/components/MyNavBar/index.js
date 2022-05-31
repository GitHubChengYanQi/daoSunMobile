import React  from 'react';
import { NavBar } from 'antd-mobile';
import { history, useModel } from 'umi';
import { ToolUtil } from '../ToolUtil';

const MyNavBar = ({ title }) => {

  const { initialState } = useModel('@@initialState');

  const state = initialState || {};

  window.document.title = state.systemName ? `${title}-${state.systemName}` : title;

  return !ToolUtil.isQiyeWeixin() && <div style={{ height: 45, position: 'sticky', top: 0, zIndex: 999 }}>
    <NavBar style={{
      '--border-bottom': '1px #eee solid',
      backgroundColor: '#fff',
    }} onBack={() => {
      history.goBack();
    }}>{title || '标题'}</NavBar>
  </div>;
};

export default MyNavBar;
