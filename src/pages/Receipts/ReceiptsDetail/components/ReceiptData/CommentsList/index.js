import React, { useImperativeHandle, useRef, useState } from 'react';
import MyList from '../../../../../components/MyList';
import StepList from '../../Dynamic/components/StepList';
import { dynamicList } from '../../Dynamic';

const CommentsList = ({ taskId }, ref) => {

  const [data, setData] = useState([]);

  const commentsListRef = useRef();

  const defaultParams = { type: 'comments', taskId };

  const submit = () => {
    commentsListRef.current.submit(defaultParams);
  };

  useImperativeHandle(ref, () => ({ submit }));

  return <div style={{ backgroundColor: '#fff' }}>
    <MyList noEmpty ref={commentsListRef} api={dynamicList} params={defaultParams} data={data} getData={setData}>
      <StepList remarks={data} />
    </MyList>
  </div>;
};
export default React.forwardRef(CommentsList);
