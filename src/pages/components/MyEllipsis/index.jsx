import React from 'react';
import { Typography } from 'antd';

const MyEllipsis = (
  {
    value,
    children,
    width,
  }) => {

  return <Typography.Paragraph
    ellipsis={{ rows: 1, tooltip: true }}
    style={{ width: width || '90%', margin: 0,display:'inline-block' }}>
    {value || children}
  </Typography.Paragraph>;
};

export default MyEllipsis;
