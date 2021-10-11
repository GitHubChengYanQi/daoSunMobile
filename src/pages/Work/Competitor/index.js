import React, { useEffect, useState } from 'react';
import { Affix, Col, Row } from 'antd';
import { Button, List, Search, Spin } from 'weui-react-v2';
import {
  FilterOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import CompetitorList from './CompetitorList';


const Competitor = () => {

  const [loading, setLoading] = useState(true);

  const [select, setSelect] = useState();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <Affix offsetTop={50} style={{ textAlign: 'center' }}>
        <Spin spinning={true} size='large' />
      </Affix>
    );
  }

  return (
    <>
      <Affix offsetTop={0}>
        <div>
          <div style={{ backgroundColor: '#fff' }}>
            <Row gutter={24} style={{ padding: 8 }}>
              <Col span={4}>
                <Button type='link' style={{ paddingTop: 16 }} icon={<UserAddOutlined />} onClick={() => {
                  // router.push('/Work/Business/BusinessAdd');
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
                  // router.push('/Work/Business/Screening');
                }} />
              </Col>
            </Row>
          </div>
          <List style={{ margin: 0 }} title={<>竞争对手数量 <span style={{ color: 'red' }}>444</span></>} />
        </div>
      </Affix>
      <CompetitorList select={select} />
    </>
  );
};

export default Competitor;
