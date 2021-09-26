import React from 'react';
import { ActionSheet, Button, Flex, FlexItem, List, ListItem, WhiteSpace, WingBlank } from 'weui-react-v2';
import { Affix, Col, Row, Select } from 'antd';
import { EllipsisOutlined, OrderedListOutlined, PhoneOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { router } from 'umi';
import { Card } from 'antd-mobile';

const CustomerList = () => {


  const Phones = () => {
    ActionSheet({
      title: '程彦祺/开发部长/开发部',
      menus: [
        <Flex type='flex' justify='space-around'>
          <FlexItem>固定电话</FlexItem>
          <FlexItem>17777777777</FlexItem>
        </Flex>,
        <Flex type='flex' justify='space-around'>
          <FlexItem>不固定电话</FlexItem>
          <FlexItem>18888888888</FlexItem>
        </Flex>,
      ],
      onClick: (index) => {
        return new Promise((resolve, reject) => {
          resolve(true);
        });
      },
    });
  };


  const Contacts = () => {
    ActionSheet({
      title: <Card.Header title='请选择联系人' extra={<Button size='small' type='link'>下一页</Button>} />,
      menus: [
        <Flex type='flex' justify='space-around'>
          <FlexItem>程彦祺</FlexItem>
          <FlexItem>开发部长</FlexItem>
          <FlexItem>开发部</FlexItem>
        </Flex>,
        <Flex type='flex' justify='space-around'>
          <FlexItem>宋正飞</FlexItem>
          <FlexItem>sb部部长</FlexItem>
          <FlexItem>啥也不是部</FlexItem>
        </Flex>,
        <Flex type='flex' justify='space-around'>
          <FlexItem>666</FlexItem>
          <FlexItem>开发部长</FlexItem>
          <FlexItem>开发部</FlexItem>
        </Flex>,
      ],
      onClick: (index) => {
        return new Promise((resolve, reject) => {
          Phones();
          resolve(true);
        });
      },
    });
  };

  return (
    <>
      <WingBlank>
        <List>
          <ListItem style={{ padding: 8 }} onClick={() => {
            router.push('/Work/Customer/CustomerDetail');
          }}>
            <ListItem style={{ padding: 0 }} extra='辽宁省/沈阳市/浑南区'><h3>道昕智造</h3></ListItem>
            <WhiteSpace size='md' />
            <Row gutter={24}>
              <Col span={8}>
                2021-9-25
              </Col>
              <Col span={8}>
                跟进时间:今天
              </Col>
              <Col span={8}>
                负责人:业务员
              </Col>
            </Row>
            <WhiteSpace size='md' />
            <Row gutter={24}>
              <Col span={4}>
                商机:5
              </Col>
              <Col span={5}>
                跟进:42
              </Col>
              <Col span={5}>
                合同:5
              </Col>
              <Col span={5}>
                维保:2
              </Col>
              <Col span={5}>
                人员:66
              </Col>
            </Row>
          </ListItem>
          <ListItem>
            <Flex type='flex' justify='space-around'>
              <FlexItem span={4}>
                <Button type='link' style={{ padding: 0 }} icon={<WhatsAppOutlined />} onClick={() => {
                  router.push('/Work/Customer/Track?0');
                }}> 跟进</Button>
              </FlexItem>
              <FlexItem span={4}>
                <Button type='link' style={{ padding: 0 }} icon={<OrderedListOutlined />} onClick={() => {
                  router.push('/Work/Customer/CustomerDetail');
                }}>任务</Button></FlexItem>
              <FlexItem span={4}>
                <Button type='link' style={{ padding: 0 }} icon={<PhoneOutlined />} onClick={() => {
                  Contacts();
                }}> 电话</Button></FlexItem>
              <FlexItem span={4}>
                <Button type='link' style={{ padding: 0 }} icon={<EllipsisOutlined />} onClick={() => {
                  router.push('/Work/Customer/CustomerDetail');
                }}> 更多</Button></FlexItem>
            </Flex>
          </ListItem>
        </List>
        <List>
          <ListItem style={{ padding: 8 }}>
            <ListItem style={{ padding: 0 }} extra='辽宁省/沈阳市/浑南区'><h3>中捷众创</h3></ListItem>
            <WhiteSpace size='md' />
            <Row gutter={24}>
              <Col span={8}>
                2021-9-25
              </Col>
              <Col span={8}>
                跟进时间:今天
              </Col>
              <Col span={8}>
                负责人:业务员
              </Col>
            </Row>
            <WhiteSpace size='md' />
            <Row gutter={24}>
              <Col span={4}>
                商机:5
              </Col>
              <Col span={5}>
                跟进:42
              </Col>
              <Col span={5}>
                合同:5
              </Col>
              <Col span={5}>
                维保:2
              </Col>
              <Col span={5}>
                人员:66
              </Col>
            </Row>
          </ListItem>
          <ListItem>
            <Flex type='flex' justify='space-around'>
              <FlexItem span={4}>
                <Button type='link' style={{ padding: 0 }} icon={<WhatsAppOutlined />} onClick={() => {
                  router.push('/Work/Customer/Track');
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
        <List>
          <ListItem style={{ padding: 8 }}>
            <ListItem style={{ padding: 0 }} extra='辽宁省/沈阳市/浑南区'><h3>程氏集团</h3></ListItem>
            <WhiteSpace size='md' />
            <Row gutter={24}>
              <Col span={8}>
                2021-9-25
              </Col>
              <Col span={8}>
                跟进时间:今天
              </Col>
              <Col span={8}>
                负责人:业务员
              </Col>
            </Row>
            <WhiteSpace size='md' />
            <Row gutter={24}>
              <Col span={4}>
                商机:5
              </Col>
              <Col span={5}>
                跟进:42
              </Col>
              <Col span={5}>
                合同:5
              </Col>
              <Col span={5}>
                维保:2
              </Col>
              <Col span={5}>
                人员:66
              </Col>
            </Row>
          </ListItem>
          <ListItem>
            <Flex type='flex' justify='space-around'>
              <FlexItem span={4}>
                <Button type='link' style={{ padding: 0 }} icon={<WhatsAppOutlined />} onClick={() => {
                  router.push('/Work/Customer/Track');
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
      </WingBlank>
    </>
  );
};

export default CustomerList;
