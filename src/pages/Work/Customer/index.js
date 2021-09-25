import React, { useState } from 'react';
import { Button, List, SafeArea, Search, SegmentedControl } from 'weui-react-v2';
import { HourglassOutlined, UserAddOutlined } from '@ant-design/icons';
import CustomerList from './CustomerList';
import ContactsList from './ContactsList';
import { router } from 'umi';

const Customer = () => {

  const [value,setValue] = useState('customer');


  const content = ()=>{
    switch (value){
      case 'customer':
        return (<CustomerList />);
      case 'contacts':
        return (<ContactsList />);
    }
  }

  return (
    <>
      <div style={{backgroundColor:'#fff'}}>
        <Button type='link' icon={<UserAddOutlined />} onClick={()=>{
          router.push('/Work/Customer/CustomerAdd');
        }} />
        <SafeArea style={{display:'inline-block',maxWidth:'70%'}}>
          <Search
            style={{backgroundColor:'#fff',border:'solid 1px #eee',fontSize:24,padding:'0 8px',borderRadius:100,margin:'8px 0'}}
            placeholder="请输入公司名称、人员名称、手机号"
            // onConfirm={(val) => console.log('确认输入: ', val)}
            // onSearch={(val) => console.log('search: ', val)}
            // onCancel={() => console.log('取消搜索')}
          />
        </SafeArea>
        <Button type='link' icon={<HourglassOutlined />} />
      </div>
      <List style={{margin:0}} title={<>客户数量 <span style={{color:'red'}}>500</span>家</>}>
        <SegmentedControl
          style={{border:'none'}}
          data={[
          {
            label: '客户',
            value: 'customer',
          },
          {
            label: '联系人',
            value: 'contacts',
          },
        ]} defaultValue="customer" onChange={(value) => setValue(value)} />
        {content()}
      </List>
    </>
  );
};

export default Customer;
