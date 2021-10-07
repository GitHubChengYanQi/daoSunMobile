import React, {useState } from 'react';
import {
  Button,
  List,
  SegmentedControl,
  Search,
} from 'weui-react-v2';
import  { FilterOutlined,UserAddOutlined } from '@ant-design/icons';
import CustomerList from './CustomerList';
import ContactsList from './ContactsList';
import { router } from 'umi';
import './index.scss';
import {Col, Row } from 'antd';

const Customer = () => {

  const params = window.location.href.split('?')[1];


  const [value, setValue] = useState(params || 'customer');





  const content = () => {
    switch (value) {
      case 'customer':
        return (<CustomerList />);
      case 'contacts':
        return (<ContactsList />);
      default:
        break;
    }
  };

  return (
    <>
      <>
        <div style={{ backgroundColor: '#fff' }}>
          <Row gutter={24} style={{ padding: 8 }}>
            <Col span={4}>
              <Button type='link' style={{ paddingTop: 16 }} icon={<UserAddOutlined />} onClick={() => {
                router.push('/Work/Customer/CustomerAdd');
              }} />
            </Col>
            <Col span={16}>
              <Search style={{backgroundColor: '#fff', border: 'solid 1px #eee',padding:'0 8px',margin:8, borderRadius: 100 }}
                      placeholder='搜索客户' maxLength={8} />
            </Col>
            <Col span={4}>
              <Button type='link' style={{ paddingTop: 16 }} icon={<FilterOutlined />} onClick={() => {
                router.push('/Work/Customer/Screening');
              }} />
            </Col>
          </Row>


        </div>
        <List style={{ margin: 0 }}>
          <SegmentedControl
            style={{ border: 'none' }}
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
      </>
    </>
  );
};

export default Customer;
