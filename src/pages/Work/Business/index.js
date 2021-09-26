import React, { useEffect, useState } from 'react';
import {
  Button,
  Flex,
  FlexItem,
  List,
  ListItem,
  SafeArea,
  Search,
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
import { Col, Row } from 'antd';


const Business = () => {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <Flex justify='center' style={{ marginTop: 64 }}>
        <Spin spinning={true} size='large' />
      </Flex>
    );
  }

  return (
    <>
      <WingBlank>
        <div style={{ backgroundColor: '#fff' }}>
          <Row gutter={24}>
            <Col span={4}>
              <Button type='link' style={{ paddingTop: 16 }} icon={<UserAddOutlined />} onClick={() => {
                router.push('/Work/Business/BusinessAdd');
              }} />
            </Col>
            <Col span={16}>
              <SafeArea>
                <Search
                  style={{
                    backgroundColor: '#fff',
                    border: 'solid 1px #eee',
                    fontSize: 24,
                    padding: '0 8px',
                    borderRadius: 100,
                    margin: '8px 0',
                  }}
                  placeholder='请输入项目名称'
                  // onConfirm={(val) => console.log('确认输入: ', val)}
                  // onSearch={(val) => console.log('search: ', val)}
                  // onCancel={() => console.log('取消搜索')}
                />
              </SafeArea>
            </Col>
            <Col span={4}>
              <Button type='link' style={{ paddingTop: 16 }} icon={<FilterOutlined />} />
            </Col>
          </Row>
        </div>
        <List style={{ margin: 0 }} title={<>项目数量 <span style={{ color: 'red' }}>666</span></>}>
          <List>
            <ListItem>
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
                <FlexItem span={4}>
                  <Button type='link' style={{ padding: 0 }} icon={<WhatsAppOutlined />} onClick={() => {
                    router.push('/Work/Customer/Track?1');
                  }}> 跟进</Button>
                </FlexItem>
                <FlexItem span={4}>
                  <Button type='link' style={{ padding: 0 }} icon={<OrderedListOutlined />}> 任务</Button></FlexItem>
                <FlexItem span={4}>
                  <Button type='link' style={{ padding: 0 }} icon={<PhoneOutlined />}> 电话</Button></FlexItem>
                <FlexItem span={4}>
                  <Button type='link' style={{ padding: 0 }} icon={<EllipsisOutlined />}> 更多</Button></FlexItem>
              </Flex>
            </ListItem>
          </List>
        </List>
      </WingBlank>
    </>
  );
};

export default Business;
