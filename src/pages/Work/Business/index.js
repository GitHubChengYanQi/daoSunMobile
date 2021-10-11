import React, { useState } from 'react';
import {
  Button,
  Search,
} from 'weui-react-v2';
import {
  FilterOutlined, PlusOutlined,
} from '@ant-design/icons';
import { router } from 'umi';
import { Affix, Col, Row } from 'antd';
import BusinessList from './BusinessList';
import { Popup } from 'antd-mobile';
import Screening from './Screening';


const Business = () => {

  const [screening, setScreening] = useState();

  const [select, setSelect] = useState();

  return (
    <>
      <Affix offsetTop={0}>
        <div style={{ backgroundColor: '#fff' }}>
          <Row gutter={24} style={{ padding: 8 }}>
            <Col span={4}>
              <Button type='link' style={{ paddingTop: 16 }} icon={<PlusOutlined />} onClick={() => {
                router.push('/Work/Business/BusinessAdd');
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
                placeholder='搜索项目'
                maxLength={8}
                onConfirm={(value) => {
                  setSelect({ businessName: value });
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
        </div>
      </Affix>
      <BusinessList select={select} />
    </>
  );
};

export default Business;
