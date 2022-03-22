import React from 'react';
import { Space } from 'antd-mobile';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import MyCheckUser from '../../../../../components/MyCheckUser';

const SelectUser = ({ value, onChange }) => {

  const showUser = (name) => {
    return <Space align='center'>
      <Avatar size={24}> <span style={{ fontSize: 14 }}>{name.substring(0, 1)}</span></Avatar>{name}
    </Space>;
  };

  const showDefault = () => {
    return <Space align='center'>
      <Avatar size={24}> <span style={{ fontSize: 14 }}><UserOutlined /></span></Avatar>待认领
    </Space>;
  };

  return <>
    <MyCheckUser value={value} onChange={onChange}>
      {value ? showUser(value.name) : showDefault()}
    </MyCheckUser>
  </>;
};

export default SelectUser;
