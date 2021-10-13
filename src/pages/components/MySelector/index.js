import { Selector } from 'antd-mobile';
import React from 'react';


const MySelector = ({api,onChange,value}) => {


  return (
    <Selector
      style={{ '--checked-color': '#ffe2e5' }}
      options={api || []}
      multiple={false}
      onChange={(value)=>{
        typeof onChange === 'function' && onChange(value[0]);
      }}
    />
  );
};

export default MySelector;
