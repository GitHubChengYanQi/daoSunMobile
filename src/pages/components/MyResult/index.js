import React from 'react';
import { Result } from 'antd-mobile';

const MyResult = (
  {
    status = 'success',
    title = '操作成功',
    description,
    className,
  },
) => {


  return <Result
    className={className}
    status={status}
    title={title}
    description={description}
  />;
};

export default MyResult;
