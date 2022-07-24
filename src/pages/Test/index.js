import React, { useState } from 'react';
import MyTextArea from '../components/MyTextArea';

const Test = () => {

  const [value, setValue] = useState();

  return <div style={{ textAlign: 'center' }}>
    <MyTextArea value={value} onChange={setValue} />
  </div>;
};

export default Test;
