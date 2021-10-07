import React from 'react';
import { useRequest } from '../../../util/Request';
import { ListItem, Picker, Stripe } from 'weui-react-v2';


const MyPicker = ({ api,value,onChange }) => {


  const { data } = useRequest(api);

  if (data){
    return (
      <>
        <Picker title='请选择' placeholder='请选择' data={data} onConfirm={(value,object)=>{
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
