import React, { useState } from 'react';
import StepList from './components/StepList';
import MyList from '../../../../components/MyList';

export const dynamicList = { url: '/dynamic/v1.0.1/lsit', method: 'POST' };

const Dynamic = ({ taskId }) => {

  const [data, setData] = useState([]);

  return <div style={{ backgroundColor: '#fff' }}>
    <MyList api={dynamicList} params={{ taskId }} data={data} getData={setData}>
      <StepList remarks={data} />
    </MyList>
  </div>;
};

export default Dynamic;
