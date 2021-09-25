import React, { useState } from 'react';
import { Button, List, SafeArea, Search, SegmentedControl, WingBlank } from 'weui-react-v2';
import { FilterOutlined, HourglassOutlined, UserAddOutlined } from '@ant-design/icons';
import CustomerList from './CustomerList';
import ContactsList from './ContactsList';
import { router } from 'umi';
import './index.scss'
import { Col, Row } from 'antd';

const Customer = () => {

  const params =  window.location.href.split('?')[1];

  const [value,setValue] = useState(params || 'customer');


  const content = ()=>{
    switch (value){
      case 'customer':
        return (<CustomerList />);
      case 'contacts':
        return (<ContactsList />);
    }
  }

  return (
    <WingBlank>
      <div style={{backgroundColor:'#fff'}}>
        <Row gutter={24}>
          <Col span={4}>
            <Button type='link' style={{paddingTop:16}} icon={<UserAddOutlined />} onClick={()=>{
              router.push('/Work/Customer/CustomerAdd');
            }} />
          </Col>
          <Col span={16}>
            <SafeArea>
              <Search
                style={{backgroundColor:'#fff',border:'solid 1px #eee',fontSize:24,padding:'0 8px',borderRadius:100,margin:'8px 0'}}
                placeholder="请输入公司名称、人员名称、手机号"
                // onConfirm={(val) => console.log('确认输入: ', val)}
                // onSearch={(val) => console.log('search: ', val)}
                // onCancel={() => console.log('取消搜索')}
              />
            </SafeArea>
          </Col>
          <Col span={4}>
            <Button type='link' style={{paddingTop:16}} icon={<FilterOutlined />} />
          </Col>
        </Row>



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
        ]} defaultValue={params || 'customer'} onChange={(value) => setValue(value)} />
        {content()}
      </List>
    </WingBlank>
  );
};

export default Customer;
