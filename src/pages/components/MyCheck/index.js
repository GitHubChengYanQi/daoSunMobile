import React from 'react';
import Icon from '../Icon';
import { Checkbox } from 'antd-mobile';
import LinkButton from '../LinkButton';
import { ToolUtil } from '../ToolUtil';
import style from './index.less';

const MyCheck = (
  {
    checked,
    onChange = () => {
    },
    children,
    fontSize = 14,
    disabled,
    className,
  }) => {

  return <LinkButton
    disabled={disabled}
    color='default'
    style={{ height: fontSize }}
    className={ToolUtil.classNames(className, style.check)}
    onClick={() => {
      onChange(!checked);
    }}>
    {checked ? <Icon type='icon-duoxuanxuanzhong1' style={{ fontSize, marginRight: 8 }} /> :
      <Icon type='icon-a-44-110' style={{ color: 'var(--adm-color-primary)', fontSize, marginRight: 8 }} />}
    {children}
  </LinkButton>;
};

export default MyCheck;
