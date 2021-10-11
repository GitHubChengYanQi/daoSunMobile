import { Steps } from 'antd-mobile';
import React from 'react';

const {Step} = Steps;


const StepDetail = ({value}) => {


  return (
    <>
      <Steps direction='vertical' current={value && value.process.length - 1}>
        {value && value.process && value.process.map((items,index)=>{
          return (
            <Step key={index} title={items.name} description={items.note} />
          );
        })}
      </Steps>
    </>
  );
};

export default StepDetail;
