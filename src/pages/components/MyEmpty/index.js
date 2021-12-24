import React from 'react';
import { Empty } from 'antd-mobile';

const MyEmpty = ({ description }) => {

  return  <Empty
    style={{ padding: '64px 0',height:'100vh',backgroundColor:'#fff' }}
    imageStyle={{ width: 128 }}
    description={description || '暂无数据'}
  />
};
export default MyEmpty;
