import React, { useState } from 'react';
import MyStepper from '../components/MyStepper';

const Test = () => {

  const [value,onChange] = useState(0);

  return <>
  <MyStepper open value={value} onChange={onChange} decimal={2} />
  </>;
};

export default Test;
