import React, { useEffect, useState } from 'react';
import {
  Button,
  Flex,
  FlexItem,
  List,
  ListItem,
  SafeArea,
  SegmentedControl,
  Spin,
  WingBlank,
} from 'weui-react-v2';
import {
  EllipsisOutlined,
  FilterOutlined, OrderedListOutlined, PhoneOutlined,
  UserAddOutlined, WhatsAppOutlined,
} from '@ant-design/icons';
import { router } from 'umi';
import { Affix, Col, Row } from 'antd';
import NavBar from '../../components/NavBar';
import { Search } from 'antd-mobile';


const Business = () => {

  const [loading, setLoading] = useState(true);

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
      <NavBar title='项目列表' />
      <>
        <div style={{ backgroundColor: '#fff' }}>
          <Row gutter={24} style={{ padding: 8 }}>
            <Col span={4}>
              <Button type='link' style={{ paddingTop: 16 }} icon={<UserAddOutlined />} onClick={() => {
                router.push('/Work/Business/BusinessAdd');
              }} />
            </Col>
            <Col span={16}>
              <Search style={{ backgroundColor: '#fff', border: 'solid 1px #eee', borderRadius: 100 }}
                      placeholder='搜索项目' maxLength={8} />
            </Col>
            <Col span={4}>
              <Button type='link' style={{ paddingTop: 16 }} icon={<FilterOutlined />} onClick={() => {
                router.push('/Work/Business/Screening');
              }} />
            </Col>
          </Row>
        </div>
        <List style={{ margin: 0 }} title={<>项目数量 <span style={{ color: 'red' }}>666</span></>}>
          <List>
            <ListItem onClick={() => {
              router.push('/Work/Business/BusinessDetail');
            }}>
              <ListItem style={{ padding: 0 }} extra='客户：无限乱斗'><h3>英雄联盟</h3></ListItem>
              <Row gutter={24}>
                <Col span={8}>
                  负责人:业务员
                </Col>
                <Col span={8}>
                  机会来源:其他
                </Col>
                <Col span={8}>
                  2021-9-25
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={8}>
                  盈率：60%
                </Col>
                <Col span={8}>
                  阶段：谈判审核
                </Col>
              </Row>
            </ListItem>
            <ListItem>
              <Flex type='flex' justify='space-around'>
                <FlexItem>
                  <Button type='link' style={{ padding: 0 }} icon={<WhatsAppOutlined />} onClick={() => {
                    router.push('/Work/Customer/Track?1');
                  }}> 跟进</Button>
                </FlexItem>
                <FlexItem>
                  <Button type='link' style={{ padding: 0 }} icon={<EllipsisOutlined />} onClick={() => {
                    router.push('/Work/Business/BusinessDetail');
                  }}> 更多</Button></FlexItem>
              </Flex>
            </ListItem>
          </List>
        </List>
      </>
    </>
  );
};

export default Business;
