import React from 'react';
import { Typography } from 'antd';

const MyEllipsis = (
  {
    value,
    children,
    width,
    style,
  }) => {

  return <div style={{
    width: width || '90%',
    display:'inline-block',
    textOverflow:'ellipsis',
    overflow:'hidden',
    whiteSpace: 'nowrap',
    ...style
  }}>
    {value || children}
  </div>;
};

export default MyEllipsis;
