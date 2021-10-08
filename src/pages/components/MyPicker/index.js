import React from 'react';
import { useRequest } from '../../../util/Request';
import { ListItem, Picker, Stripe } from 'weui-react-v2';


const MyPicker = ({ api,value,onChange,option,disabled }) => {


  const { loading,data } = useRequest(api,{manual:option});

  if (option || data){
    return (
      <>
        <Picker title='请选择' placeholder='请选择' disabled={disabled} data={option || data} value={[value]} onConfirm={(value,object)=>{
          onChange(value && value[0]);
        }}>
          <ListItem arrow={true} style={{padding:0}} />
        </Picker>
      </>
    );
  }else {
    return <Stripe />;
  }



};

export default MyPicker;
