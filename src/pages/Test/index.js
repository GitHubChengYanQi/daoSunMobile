import React, { useRef } from 'react';
import Bouncing from '../components/Bouncing';
import { Button } from 'antd-mobile';

const Test = () => {

  const ref = useRef();

  return <div style={{ textAlign: 'center' }}>
    <Button onClick={()=>ref.current.jump()}>123</Button>
    <Bouncing ref={ref} />
  </div>;
};

export default Test;
