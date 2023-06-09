import React from 'react';
import { Empty } from 'antd-mobile';

const MyEmpty = ({ description, height,image }) => {

  return  <Empty
    image={image}
    style={{ height:height || '100%',backgroundColor:'#fff' }}
    imageStyle={{ width: 128 }}
    description={description || '暂无数据'}
  />;
};
export default MyEmpty;
