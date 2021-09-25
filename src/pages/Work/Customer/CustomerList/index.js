import React from 'react';
import { Button, Flex, FlexItem, List, ListItem, WingBlank } from 'weui-react-v2';
import { Col, Row } from 'antd';
import { EllipsisOutlined, OrderedListOutlined, PhoneOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { router } from 'umi';

const CustomerList = () => {

  return (
    <>
      <WingBlank>
      <List>
        <ListItem style={{padding:8}}>
          <ListItem style={{padding:0}} extra='辽宁省/沈阳市/浑南区'><h3>道昕智造</h3></ListItem>
          <Row gutter={24} style={{padding:'8px 0'}}>
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
          <Flex type="flex" justify="space-around">
            <FlexItem span={4}>
              <Button type='link' style={{padding:0}} icon={<WhatsAppOutlined />} onClick={()=>{
                router.push('/Work/Customer/Track?0');
              }}> 跟进</Button>
            </FlexItem>
            <FlexItem span={4}>
              <Button type='link' style={{padding:0}} icon={<OrderedListOutlined />}> 任务</Button></FlexItem>
            <FlexItem span={4}>
              <Button type='link' style={{padding:0}} icon={<PhoneOutlined />}> 电话</Button></FlexItem>
            <FlexItem span={4}>
              <Button type='link' style={{padding:0}} icon={<EllipsisOutlined />}> 更多</Button></FlexItem>
          </Flex>
        </ListItem>
      </List>
      <List>
        <ListItem style={{padding:8}}>
          <ListItem style={{padding:0}} extra='辽宁省/沈阳市/浑南区'><h3>中捷众创</h3></ListItem>
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
          <Flex type="flex" justify="space-around">
            <FlexItem span={4}>
              <Button type='link' style={{padding:0}} icon={<WhatsAppOutlined />} onClick={()=>{
                router.push('/Work/Customer/Track');
              }}> 跟进</Button>
            </FlexItem>
            <FlexItem span={4}>
              <Button type='link' style={{padding:0}} icon={<OrderedListOutlined />}> 任务</Button></FlexItem>
            <FlexItem span={4}>
              <Button type='link' style={{padding:0}} icon={<PhoneOutlined />}> 电话</Button></FlexItem>
            <FlexItem span={4}>
              <Button type='link' style={{padding:0}} icon={<EllipsisOutlined />}> 更多</Button></FlexItem>
          </Flex>
        </ListItem>
      </List>
      <List>
        <ListItem style={{padding:8}}>
          <ListItem style={{padding:0}} extra='辽宁省/沈阳市/浑南区'><h3>程氏集团</h3></ListItem>
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
          <Flex type="flex" justify="space-around">
            <FlexItem span={4}>
              <Button type='link' style={{padding:0}} icon={<WhatsAppOutlined />} onClick={()=>{
                router.push('/Work/Customer/Track');
              }}> 跟进</Button>
            </FlexItem>
            <FlexItem span={4}>
              <Button type='link' style={{padding:0}} icon={<OrderedListOutlined />}> 任务</Button></FlexItem>
            <FlexItem span={4}>
              <Button type='link' style={{padding:0}} icon={<PhoneOutlined />}> 电话</Button></FlexItem>
            <FlexItem span={4}>
              <Button type='link' style={{padding:0}} icon={<EllipsisOutlined />}> 更多</Button></FlexItem>
          </Flex>
        </ListItem>
      </List>
      </WingBlank>
    </>
  );
};

export default CustomerList;
