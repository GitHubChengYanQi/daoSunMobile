import React from 'react';
import Icon from '../Icon';
import { Checkbox } from 'antd-mobile';
import LinkButton from '../LinkButton';

const MyCheck = (
  {
    checked,
    onChange = () => {
    },
    children,
    fontSize,
    disabled,
    className,
  }) => {


  return <LinkButton disabled={disabled} className={className} onClick={() => {
    onChange(!checked);
  }}>
    <Checkbox
      checked={checked}
      icon={(checked) => {
        return checked ? <Icon type='icon-a-jianqudingceng2' style={{ fontSize }} /> :
          <Icon type='icon-jizhumimamoren' style={{ fontSize }} />;
      }}
    >
      {children}
    </Checkbox>
  </LinkButton>;
};

export default MyCheck;
