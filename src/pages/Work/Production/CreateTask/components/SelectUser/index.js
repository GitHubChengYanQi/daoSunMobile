import React from 'react';
import { Button, Space } from 'antd-mobile';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import MyCheckUser from '../../../../../components/MyCheckUser';
import { getHeader } from '../../../../../components/GetHeader';
import { connect } from 'dva';
const SelectUser = ({ value, onChange,...props }) => {

  const showUser = (name) => {
    return <Space align='center'>
      <Avatar size={32}> <span style={{ fontSize: 24 }}>{name.substring(0, 1)}</span></Avatar>{name}
    </Space>;
  };

  const showDefault = () => {
    return <Space align='center'>
      <Avatar size={32}> <span style={{ fontSize: 24 }}><UserOutlined /></span></Avatar>待认领
    </Space>;
  };

  return <>
    {!getHeader() ?
      <Button onClick={() => {
        props.dispatch({
          type: 'qrCode/checkUsers',
        });
      }}>选人</Button>
      :
      <MyCheckUser value={value} onChange={onChange}>
        {value ? showUser(value.name) : showDefault()}
      </MyCheckUser>}
  </>;
};

export default connect(({ qrCode }) => ({ qrCode }))(SelectUser);
