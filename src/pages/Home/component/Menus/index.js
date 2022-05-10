import React from 'react';
import Icon from '../../../components/Icon';
import { Space } from 'antd-mobile';
import MyEllipsis from '../../../components/MyEllipsis';

const Menus = (
  {
    code,
    name,
    fontSize,
    onlyIcon,
    textOverflow,
  }) => {

  const MenusStyle = ({ icon, title }) => {
    if (onlyIcon) {
      return <Icon type={icon} style={{ fontSize }} />;
    }
    return <Space direction='vertical' align='center' style={{ width: '100%' }}>
      <Icon type={icon} style={{ fontSize }} />
      <MyEllipsis width={textOverflow || '100%'} style={{ textAlign: 'center' }}>
        {title || name}
      </MyEllipsis>
    </Space>;
  };
  if (!code) {
    return MenusStyle({ icon: 'icon-gengduo', title: '更多' });
  }

  switch (code) {
    case 'purchase':
      return MenusStyle({ icon: 'icon-caigouguanli' });
    case 'SPU':
      return MenusStyle({ icon: 'icon-chanyanguanli' });
    case 'production':
      return MenusStyle({ icon: 'icon-caidan-shengchanguanli' });
    case 'ERP':
      return MenusStyle({ icon: 'icon-cangchuguanli' });
    case 'CRM':
      return MenusStyle({ icon: 'icon-crmguanli' });
    case 'process':
      return MenusStyle({ icon: 'icon-shenpi2' });
    case 'task':
      return MenusStyle({ icon: 'icon-renwu' });
    case 'message':
      return MenusStyle({ icon: 'icon-xiaoxi1' });
    default:
      return MenusStyle({ icon: 'icon-gengduo' });
  }
};

export default Menus;
