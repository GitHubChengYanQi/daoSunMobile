import React from 'react';
import { Button } from 'antd-mobile';

const LinkButton = ({ children, title, style, onClick, color, disabled,className }) => {

  return <Button
    className={className}
    color={color || 'primary'}
    disabled={disabled}
    fill='none'
    type='submit'
    style={{ padding: 0,height:'fit-content', ...style }}
    onClick={() => {
      typeof onClick === 'function' && onClick();
    }}>{title || children || 'link'}</Button>;
};

export default LinkButton;
