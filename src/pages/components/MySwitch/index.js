import { Switch } from 'antd-mobile';
import React from 'react';

const MySwitch = (
  {
    checked,
    onChange = () => {
    },
  },
) => {


  return <Switch
    checked={checked}
    style={{ '--height': '24px', '--width': '42px' }}
    onChange={onChange} />;
};

export default MySwitch;
