import React from 'react';
import Icon from '../Icon';
import { Checkbox } from 'antd-mobile';

const MyCheck = (
  {
    checked,
    onChange = () => {
    },
    children,
  }) => {


  return <Checkbox
    checked={checked}
    icon={(checked) => {
      return checked ? <Icon type='icon-a-jianqudingceng2' /> : <Icon type='icon-jizhumimamoren' />;
    }}
    onChange={onChange}
  >
    {children}
  </Checkbox>;
};

export default MyCheck;
