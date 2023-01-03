import React, { useState } from 'react';
import StartEndDate from '../components/StartEndDate';

const Test = () => {

  const [value, onChange] = useState([]);
  console.log(value);
  return <div style={{ textAlign: 'center', backgroundColor: '#fff' }}>
    <StartEndDate value={value} onChange={onChange} />
  </div>;
};

export default Test;
