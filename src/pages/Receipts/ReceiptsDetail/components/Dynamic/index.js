import React, { useState } from 'react';
import StepList from './components/StepList';
import MyList from '../../../../components/MyList';
import { remakeList } from '../../../../Work/Stock/Dynamic';

const Dynamic = ({ taskId }) => {

  const [data, setData] = useState([]);

  return <div style={{ backgroundColor: '#fff' }}>
    <MyList api={remakeList} params={{ types: ['audit', 'dynamic'], taskId }} data={data} getData={setData}>
      <StepList remarks={data} />
    </MyList>
  </div>;
};

export default Dynamic;
