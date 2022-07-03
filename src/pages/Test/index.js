import React, { useState } from 'react';
import MyTextArea from '../components/MyTextArea';
import { Button } from 'antd-mobile';

const Test = () => {

  const [value, setValue] = useState('');
  const [users,setUsers] = useState([]);

  return <>
   <MyTextArea value={value} onChange={(value,users)=>{
     setValue(value);
     setUsers(users);
   }} />
    <Button onClick={()=>{
      alert(`${users.map(item=>item.name).join('、')}`)
    }}>12321</Button>
  </>;
};

export default Test;
