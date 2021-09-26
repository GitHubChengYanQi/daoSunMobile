import { Affix } from 'antd';
import Icon, { LeftOutlined } from '@ant-design/icons';
import { router } from 'umi';
import React from 'react';
import { NavBar as AntNavBar } from 'antd-mobile';

const NavBar = ({title}) => {

  return (
    <Affix offsetTop={0}>
      <AntNavBar
        mode='light'
        icon={<LeftOutlined />}
        onLeftClick={() => router.goBack()}
        rightContent={[
          <Icon key='0' type='search' style={{ marginRight: '16px' }} />,
          <Icon key='1' type='ellipsis' />,
        ]}
      >{title}</AntNavBar>
    </Affix>
  );
};

export default NavBar;
