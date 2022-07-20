import React from 'react';
import { ErrorBlock } from 'antd-mobile';

const MyError = (
  {
    title,
    description,
  }
) => {


  return <ErrorBlock
    fullPage
    title={title}
    description={description}
  />
};

export default MyError;
