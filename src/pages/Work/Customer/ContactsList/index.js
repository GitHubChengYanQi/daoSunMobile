import React from 'react';
import { ActionSheet, Button, Flex, FlexItem, List, ListItem } from 'weui-react-v2';
import { Affix, Avatar, Col, Row, Select } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';
import { router } from 'umi';

const ContactsList = () => {

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

  return (
    <>
      <List>
        <Row gutter={24}>
          <Col span={4} style={{
            padding:16
          }}>
              <Avatar size={56}>程</Avatar>
          </Col>
          <Col span={20}>
            <ListItem>
              <ListItem style={{padding:0}} extra={<Button onClick={()=>{
                Phones();
              }} type='link' style={{padding:0}} icon={<PhoneOutlined />}>拨打电话</Button>}><h3>程彦祺</h3></ListItem>
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
