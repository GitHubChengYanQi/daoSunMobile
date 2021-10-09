import React, { useEffect, useState } from 'react';
import { Affix, Badge, Col, Row } from 'antd';
import { Button, Flex, FlexItem, List, ListItem, Search, Skeleton, Spin, WingBlank } from 'weui-react-v2';
import Icon, {
  EllipsisOutlined,
  FilterOutlined,
  LeftOutlined,
  UserAddOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons';
import { router } from 'umi';
import { Card, InfiniteScroll } from 'antd-mobile';
import { useRequest } from '../../../util/Request';
import ContractList from './ContractList';


const Contract = () => {


  return (
    <>
      <Affix offsetTop={0}>
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
                placeholder='搜索合同' maxLength={8} />
            </Col>
            <Col span={4}>
              <Button type='link' style={{ paddingTop: 16 }} icon={<FilterOutlined />} onClick={() => {
                // router.push('/Work/Business/Screening');
              }} />
            </Col>
          </Row>
        </div>
      </Affix>
      <ContractList />
    </>
  );


};

export default Contract;
