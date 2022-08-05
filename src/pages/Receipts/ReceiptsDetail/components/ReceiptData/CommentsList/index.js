import React, { useImperativeHandle, useRef, useState } from 'react';
import MyList from '../../../../../components/MyList';
import { remakeList } from '../../../../../Work/Stock/Dynamic';
import StepList from '../../Dynamic/components/StepList';

const CommentsList = ({ taskId }, ref) => {

  const [data, setData] = useState([]);

  const commentsListRef = useRef();

  const defaultParams = { type: 'comments', taskId };

  const submit = () => {
    commentsListRef.current.submit(defaultParams);
  };

  useImperativeHandle(ref, () => ({ submit }));

  return <div style={{ backgroundColor: '#fff' }}>
    <MyList ref={commentsListRef} api={remakeList} params={defaultParams} data={data} getData={setData}>
      <StepList remarks={data} />
    </MyList>
  </div>;
};
export default React.forwardRef(CommentsList);
