import React, { useImperativeHandle, useRef, useState } from 'react';
import MyList from '../../../../../components/MyList';
import StepList from '../../Dynamic/components/StepList';
import Comments from '../../../../components/Comments';


export const remakeList = { url: '/remarks/list', method: 'POST' };

const CommentsList = ({ taskId,addComments,detail }) => {

  const [data, setData] = useState([]);

  const commentsListRef = useRef();

  const defaultParams = { type: 'comments', taskId };

  return <div style={{ backgroundColor: '#fff' }}>
    <Comments
      all={data.length > 0}
      placeholder='添加评论,可@相关人员'
      title='添加评论'
      detail={detail}
      id={detail.processTaskId}
      refresh={() => commentsListRef.current.submit(defaultParams)}
      onInput={addComments}
    />
    <MyList noEmpty ref={commentsListRef} api={remakeList} params={defaultParams} data={data} getData={setData}>
      <StepList remarks={data} />
    </MyList>
  </div>;
};
export default CommentsList;
