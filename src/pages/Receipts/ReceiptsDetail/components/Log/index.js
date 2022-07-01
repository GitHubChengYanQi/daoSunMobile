import React, { useEffect, useRef, useState } from 'react';
import style from './index.less';
import StepList from './components/StepList';

const Log = (
  {
    data = {},
    refresh = () => {
    },
  },
) => {


  const [remarks, setRemarks] = useState([]);

  useEffect(() => {
    const remarks = data.remarks || []
    setRemarks(remarks.filter(item=>item.type === 'dynamic'));
  }, [data.remarks]);

  const ref = useRef();

  return <div className={style.log}>
    <StepList remarks={remarks} onChange={setRemarks} addComments={(remarksId) => {
      ref.current.addComments(remarksId);
    }} />

  </div>;
};

export default Log;
