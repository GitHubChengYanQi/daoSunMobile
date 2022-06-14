import React from 'react';
import Icon from '../Icon';
import { Checkbox } from 'antd-mobile';

const MyCheck = (
  {
    checked,
    onChange = () => {
    },
    children,
    fontSize,
  }) => {


  return <Checkbox
    checked={checked}
    icon={(checked) => {
      return checked ? <Icon type='icon-a-jianqudingceng2' style={{fontSize}} /> : <Icon type='icon-jizhumimamoren' style={{fontSize}} />;
    }}
    onChange={onChange}
  >
    {children}
  </Checkbox>;
};

export default MyCheck;
