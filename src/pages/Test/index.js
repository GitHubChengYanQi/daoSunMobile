import React, { useState } from 'react';
import MyStepper from '../components/MyStepper';

const Test = () => {

  const [value, onChange] = useState(0);

  return <>
    <MyStepper onChange={onChange} value={value} min={5} max={13} open />
  </>;
};

export default Test;
