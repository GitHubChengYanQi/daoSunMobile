import React from 'react';
import { Button, Flex, FlexItem, List, ListItem } from 'weui-react-v2';
import { Avatar, Col, Row } from 'antd';
import { EllipsisOutlined, OrderedListOutlined, PhoneOutlined, WhatsAppOutlined } from '@ant-design/icons';

const ContactsList = () => {

  return (
    <>
      <List>
        <Row gutter={24}>
          <Col span={5}>
              <Avatar size={64} style={{margin:16}}>LOGO</Avatar>
          </Col>
          <Col span={19}>
            <ListItem>
              <ListItem style={{padding:0}} extra={<Button type='link' style={{padding:0}} icon={<PhoneOutlined />}>拨打电话</Button>}><h3>程彦祺</h3></ListItem>
              <div>暂无公司信息</div>
              <div>手机号：17741061962 &nbsp;&nbsp;|&nbsp;&nbsp; 职务：总经理 </div>
            </ListItem>
          </Col>
        </Row>
      </List>
    </>
  );
};

export default ContactsList;
