import React, { useState } from 'react';
import MyStepper from '../components/MyStepper';
import { Stepper } from 'antd-mobile';

const Test = () => {

  const [value, onChange] = useState(0);

  return <>
    <Stepper min={5} max={13} />
    <MyStepper onChange={onChange} value={value} min={5} max={13} />
  </>;
};

export default Test;
