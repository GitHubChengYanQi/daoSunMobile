import React from 'react';
import { timeDifference } from '../components/ToolUtil';

const Test = () => {

  const time = '2022-10-22 23:59:59';

  return <div style={{ textAlign: 'center', backgroundColor: '#fff' }}>
    {timeDifference(time)}
  </div>;
};

export default Test;
