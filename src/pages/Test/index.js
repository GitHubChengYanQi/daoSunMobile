import React, { useRef } from 'react';
import { ScanIcon } from '../components/Icon';
import InkindList from '../components/InkindList';

const Test = () => {

  const ref = useRef();

  return <div style={{ textAlign: 'center' }}>
    <ScanIcon onClick={() => {
      ref.current.open({skuId:'1524235225068818433'});
    }} />

    <InkindList ref={ref} />
  </div>;
};

export default Test;
