import React from 'react';
import { useRequest } from '../../../util/Request';
import { ListItem, Picker, Stripe } from 'weui-react-v2';
import { useDebounceEffect } from 'ahooks';


const MyPicker = ({ api,value,onChange=()=>{},option,disabled }) => {

  useDebounceEffect(()=>{
    !option && run({});
  },[api, option],{
    wait:0
  })


  const { data,run } = useRequest(api,{manual:option});

  if (option || data){
    return (
      <div>
        <Picker title='请选择' placeholder='请选择' disabled={disabled} data={option || data} value={[value]} onConfirm={(value,object)=>{
          onChange(value && value[0]);
        }}>
          <ListItem arrow={true} style={{padding:0}} />
        </Picker>
      </div>
    );
  }else {
    return <Stripe />;
  }



};

export default MyPicker;
