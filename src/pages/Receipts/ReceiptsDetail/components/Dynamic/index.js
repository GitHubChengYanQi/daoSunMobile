import React, { useEffect, useRef, useState } from 'react';
import StepList from './components/StepList';

const Dynamic = (
  {
    data = {},
  },
) => {


  const [remarks, setRemarks] = useState([]);

  useEffect(() => {
    const remarks = data.remarks || [];
    setRemarks(remarks.filter(item => ['audit', 'dynamic'].includes(item.type)));
  }, [data.remarks]);

  const ref = useRef();

  return <div style={{ backgroundColor: '#fff' }}>
    <StepList remarks={remarks} onChange={setRemarks} addComments={(remarksId) => {
      ref.current.addComments(remarksId);
    }} />
  </div>;
};

export default Dynamic;
