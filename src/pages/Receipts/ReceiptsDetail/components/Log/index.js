import React, { useEffect, useRef, useState } from 'react';
import StepList from './components/StepList';

const Log = (
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

  return <div style={{ paddingTop: 24, backgroundColor: '#fff' }}>
    <StepList remarks={remarks} onChange={setRemarks} addComments={(remarksId) => {
      ref.current.addComments(remarksId);
    }} />
  </div>;
};

export default Log;
