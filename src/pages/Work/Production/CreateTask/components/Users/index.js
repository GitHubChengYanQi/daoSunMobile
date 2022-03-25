import React from 'react';
import { Avatar } from 'antd';
import { AddOutline } from 'antd-mobile-icons';
import MyCheckUser from '../../../../../components/MyCheckUser';
import { Space } from 'antd-mobile';

const Users = ({ value = [], onChange }) => {

  return <Space wrap>
    {
      value.map((item, index) => {
        return item && <Avatar key={index} onClick={() => {
          const array = value.filter((user) => {
            return user.id !== item.id;
          });
          onChange(array);
        }}>{item.name}</Avatar>;
      })
    }
    <MyCheckUser value={value} all onChange={(user) => {
      onChange([...value, user]);
    }}>
      <Avatar><AddOutline /></Avatar>
    </MyCheckUser>
  </Space>;

};

export default Users;
