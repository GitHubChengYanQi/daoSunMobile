import React, { useEffect, useRef, useState } from 'react';
import Comments from '../../../components/Comments';
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
    setRemarks(data.remarks || []);
  }, [data.remarks]);

  const ref = useRef();

  return <div className={style.log}>
    <Comments detail={data} id={data.processTaskId} title='添加评论' refresh={refresh} ref={ref} />
    <StepList remarks={remarks} onChange={setRemarks} addComments={(remarksId) => {
      ref.current.addComments(remarksId);
    }} />

  </div>;
};

export default Log;
