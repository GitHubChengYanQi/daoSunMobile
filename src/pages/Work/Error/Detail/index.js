import React from 'react';
import { useLocation } from 'umi';

export const orderDetail = { url: '/anomalyOrder/detail', method: 'POST' };

const Detail = () => {

  const params = useLocation();

  console.log(params);

  return <>

  </>;
};

export default Detail;
