import React from 'react';
import { Typography } from 'antd';

const MyEllipsis = (
  {
    value,
    children,
    width,
  }) => {

  return <span style={{
    width: width || '90%',
    display:'inline-block',
    textOverflow:'ellipsis',
    overflow:'hidden',
    whiteSpace: 'nowrap'
  }}>
    {value || children}
  </span>;
};

export default MyEllipsis;
