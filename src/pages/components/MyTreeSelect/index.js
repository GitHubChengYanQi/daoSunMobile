import React, { useState } from 'react';
import { Button, Card, Popup, TreeSelect } from 'antd-mobile';
import { useRequest } from '../../../util/Request';
import { ListItem } from 'weui-react-v2';

const MyTreeSelect = ({ api, value, onChange, title }) => {

  const { data } = useRequest(api);

  const [visible, setVisible] = useState();

  const [name,setName] = useState([]);

  return (
    <>
      <ListItem arrow={true} style={{padding:0}} onClick={()=>{
        setVisible(true);
      }} >
        {name.length && name.map((items,index)=>{
          return (
            <span key={index}>{index !== 0 && '-'}{items.label}</span>
          );
        }) || '请选择'}
      </ListItem>
      <Popup
        visible={visible}
      >
        <Card title={title || '选择'} style={{maxHeight:'30vh',overflow:'auto'}} extra={<Button color='primary' fill='none' onClick={()=>{
          setVisible(false);
        }}>确定</Button>}>
          <TreeSelect
            value={name.map((items)=>{
              return items.value
            })}
            options={data}
            onChange={(value,object) => {
              setName(object);
              onChange(value.length > 0 && value[value.length - 1]);
            }}
          />
        </Card>
      </Popup>
    </>
  );
};

export default MyTreeSelect;
