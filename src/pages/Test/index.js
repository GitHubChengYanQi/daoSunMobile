import React from 'react';
import StartEndDate from '../components/StartEndDate';

const Test = () => {

  return <div style={{ textAlign: 'center', backgroundColor: '#fff' }}>
    <StartEndDate onChange={(value) => {
      console.log(value);
    }} />
  </div>;
};

export default Test;
