import React from 'react';
import { Button } from 'antd-mobile';

const LinkButton = ({title,style,onClick,color,disabled}) => {

  return <Button color={color || 'primary'} disabled={disabled} fill='none' style={style || {padding:0}} onClick={()=>{
    typeof onClick === 'function' && onClick();
  }}>{title || 'link'}</Button>
};

export default LinkButton;
