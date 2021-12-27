import React, {useState } from 'react';
import { Affix, Col, Row } from 'antd';
import { Button, Search } from 'weui-react-v2';
import {
  FilterOutlined, PlusOutlined,
} from '@ant-design/icons';
import CompetitorList from './CompetitorList';


const Competitor = () => {

  const [select, setSelect] = useState();

  return (
    <>
      <Affix offsetTop={0}>
        <div style={{ backgroundColor: '#fff' }}>
          <Row gutter={24} style={{ padding: 8 }}>
            <Col span={4}>
              <Button type='link' style={{ paddingTop: 16 }} icon={<PlusOutlined />} onClick={() => {
                // history.push('/Work/Business/BusinessAdd');
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
                placeholder='搜索'
                maxLength={8}
                onConfirm={(value) => {
                  setSelect({});
                }} />
            </Col>
            <Col span={4}>
              <Button type='link' style={{ paddingTop: 16 }} icon={<FilterOutlined />} onClick={() => {
                // history.push('/Work/Business/Screening');
              }} />
            </Col>
          </Row>
        </div>
      </Affix>
      <CompetitorList select={select} />
    </>
  );
};

export default Competitor;
