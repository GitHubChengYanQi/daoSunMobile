import React, { useRef, useState } from 'react';
import {
  Button,
  List,
  SegmentedControl,
  Search,
} from 'weui-react-v2';
import { FilterOutlined, UserAddOutlined } from '@ant-design/icons';
import CustomerList from './CustomerList';
import ContactsList from './ContactsList';
import { router } from 'umi';
import './index.scss';
import { Affix, Col, Row } from 'antd';
import Screening from './Screening';
import { Popup } from 'antd-mobile';

const Customer = () => {

  const params = window.location.href.split('?')[1];


  const [value, setValue] = useState(params || 'customer');

  const [screening, setScreening] = useState();



  const [select, setSelect] = useState();


  const content = () => {
    switch (value) {
      case 'customer':
        return (<CustomerList select={select} />);
      case 'contacts':
        return (<ContactsList />);
      default:
        break;
    }
  };

  return (
    <>
        <Affix offsetTop={0}>
          <Row gutter={24} style={{ padding: 8,backgroundColor:'#fff' }}>
            <Col span={4}>
              <Button type='link' style={{ paddingTop: 16 }} icon={<UserAddOutlined />} onClick={() => {
                router.push('/Work/Customer/CustomerAdd');
              }} />
            </Col>
            <Col span={16}>
              <Search
                style={{
                  backgroundColor: '#fff',
                  border: 'solid 1px #eee',
                  padding: '0 8px',
                  margin: 8,
                  borderRadius: 100,
                }}
                placeholder='搜索客户'
                maxLength={8}
                onSearch={(value) => {
                  setSelect({customerName:value})
                }} />
            </Col>
            <Col span={4}>
              <Button type='link' style={{ paddingTop: 16 }} icon={<FilterOutlined />} onClick={() => {
                setScreening(true);
              }} />
              <Popup
                visible={screening}
                onMaskClick={() => {
                  setScreening(false);
                }}
                position='right'
                bodyStyle={{ minWidth: '70vw' }}
              >
                <Screening select={(value) => {
                  setScreening(false);
                  setSelect(value);
                }} />
              </Popup>
            </Col>
          </Row>
          <SegmentedControl
            style={{ border: 'none',backgroundColor:'#fff' }}
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
        </Affix>
        <List style={{ margin: 0 }}>
          {content()}
        </List>
    </>
  );
};

export default Customer;
