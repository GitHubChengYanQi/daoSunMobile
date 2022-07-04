import React, { useState } from 'react';
import MyList from '../../../components/MyList';
import StepList from '../../../Receipts/ReceiptsDetail/components/Dynamic/components/StepList';

export const remakeList = { url: '/remarks/list', method: 'POST' };

const Dynamic = () => {

  const [data, setData] = useState([]);

  return <div style={{backgroundColor:'#fff'}}>

    <MyList api={remakeList} params={{ type: 'dynamic' }} data={data} getData={setData}>
      <StepList remarks={data} noIcon />
    </MyList>
  </div>;
};

export default Dynamic;
