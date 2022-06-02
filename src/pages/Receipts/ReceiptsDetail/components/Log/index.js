import React from 'react';
import Comments from '../../../components/Comments';

const Log = (
  {
    data = {},
  },
) => {

  return <>
    <Comments detail={data} id={data.processTaskId} />
  </>;
};

export default Log;
