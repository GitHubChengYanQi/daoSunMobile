import React from 'react';
import Icon from '../../../components/Icon';
import { Space, Toast } from 'antd-mobile';
import MyEllipsis from '../../../components/MyEllipsis';
import { history } from 'umi';
import cookie from 'js-cookie';
import style from './index.less';
import { menus } from './menus';

export const borderStyle = (index, number, length) => {

  let bottom;
  if ((length % number) === 0) {
    bottom = (length - index) <= number;
  } else {
    bottom = (length - index) <= (length % number);
  }


  return {
    borderLeft: 'none',
    borderTop: 'none',
    borderRight: (index % number) === (number - 1) && 'none',
    borderBottom: bottom && 'none',
  };
};

const Menus = (
  {
    code,
    name,
    fontSize,
    onlyIcon,
    textOverflow,
    disabled,
  }) => {

  const MenusStyle = ({ icon = 'icon-gengduo', title, url }) => {
    if (onlyIcon) {
      return <Icon type={icon} style={{ fontSize }} />;
    }
    return <Space
      className={style.menus}
      direction='vertical'
      align='center'
      style={{ width: '100%' }}
      onClick={() => {
        if (disabled) {
          return;
        }
        if (code === 'LogOut') {
          cookie.remove('cheng-token');
        }
        if (!url) {
          return Toast.show({ content: '暂未开通~', position: 'bottom' });
        }
        history.push(url);
      }}
    >
      <Icon type={icon} style={{ fontSize }} />
      <MyEllipsis width={textOverflow || '100%'} style={{ textAlign: 'center' }}>
        {title || name}
      </MyEllipsis>
    </Space>;
  };
  if (!code) {
    return MenusStyle({ icon: 'icon-gengduo', title: '更多', url: '/Home/MenusSetting' });
  }

  const menu = menus.filter(item => item.code === code)[0] || {};

  return MenusStyle(menu);
};


export default Menus;
