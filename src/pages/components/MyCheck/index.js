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
    className={ToolUtil.classNames(className, style.check)}
    onClick={() => {
      onChange(!checked);
    }}>
    <Checkbox
      style={{ '--font-size': `${fontSize}px`, '--icon-size': `${fontSize}px` }}
      checked={checked}
      icon={(checked) => {
        return checked ? <Icon type='icon-duoxuanxuanzhong1' /> :
          <Icon type='icon-a-44-110' style={{color:'#D8D8D8'}} />;
      }}
    >
      {children}
    </Checkbox>
  </LinkButton>;
};

export default MyCheck;
