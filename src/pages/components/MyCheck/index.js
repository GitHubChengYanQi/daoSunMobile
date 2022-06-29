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


  return <LinkButton disabled={disabled} color='default' className={className} onClick={() => {
    onChange(!checked);
  }}>
    <Checkbox
      style={{ '--font-size': `${fontSize}px`, '--icon-size': `${fontSize}px` }}
      checked={checked}
      icon={(checked) => {
        return checked ? <Icon type='icon-a-jianqudingceng2' /> :
          <Icon type='icon-jizhumimamoren' />;
      }}
    >
      {children}
    </Checkbox>
  </LinkButton>;
};

export default MyCheck;
