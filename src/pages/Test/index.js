import React, { useState } from 'react';
import KeepAlive from '../../components/KeepAlive';
import MyAudit from '../Work/ProcessTask/MyAudit';

export const App = () => {
  const [show, setShow] = useState(true);


  return (
    <div>
      <button onClick={() => setShow((show) => !show)}>Toggle</button>
      {show && (
        <KeepAlive id='Test'>
          <MyAudit />
        </KeepAlive>
      )}
    </div>
  );
};

const Test = () => {

  const [show, setShow] = useState(true);


  return <>
      <button style={{position:'sticky',top:0}} onClick={() => setShow((show) => !show)}>Toggle</button>
      {show && (
        <KeepAlive id='Test'>
          <MyAudit />
        </KeepAlive>
      )}
  </>;
};

export default Test;
