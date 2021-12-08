import React from 'react';
import { Button } from 'antd-mobile';

const LinkButton = ({title,style,onClick}) => {


  return <Button color='primary' fill='none' style={style || {padding:0}} onClick={()=>{
    typeof onClick === 'function' && onClick();
  }}>{title || 'link'}</Button>
};

export default LinkButton;
