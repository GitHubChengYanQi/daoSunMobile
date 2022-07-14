import React, { useState } from 'react';
import StartEndDate from '../Work/Production/CreateTask/components/StartEndDate';

const Test = () => {

  const [value, onChange] = useState([]);

  return <div style={{ textAlign: 'center' }}>
    <StartEndDate
      value={value}
      onChange={(dates) => {
        onChange(dates);
      }}
    />
  </div>;
};

export default Test;
