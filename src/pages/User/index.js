import React from 'react';
import { Button, Preview, PreviewItem } from 'weui-react-v2';
import { Affix, Avatar, Col, Row } from 'antd';
import { Card, NavBar } from 'antd-mobile';
import { LeftOutlined } from '@ant-design/icons';
import { router } from 'umi';


const User = () => {

  return (
    <>
      <Affix offsetTop={0}>
        <NavBar
          mode='light'
        >我的</NavBar>
      </Affix>
      <Row gutter={24} style={{ backgroundColor: '#fff' }}>
        <Col span={18}>
          <Preview style={{ padding: 16 }} align='left' subTitle='个人信息'>
            <Card.Header
              style={{ padding: 0 }}
              title={<h3>程彦祺</h3>}
              extra={<Button style={{ padding: 0 }} size={'small'} type='link'>设置工作状态</Button>} />
            <PreviewItem title='部门'>
              <div>666</div>
            </PreviewItem>
            <PreviewItem title='位置'>
              <div>辽宁省沈阳市</div>
            </PreviewItem>
            <PreviewItem title='职务'>
              <div>很长很长的名字很长很长的名字很长很长的名字很长很长的名字很长很长的名字</div>
            </PreviewItem>
          </Preview>
        </Col>
        <Col span={6} style={{ textAlign: 'center' }}>
          <Avatar size={64} style={{ margin: '16px 0' }}>LOGO</Avatar>
          <div>个人设置</div>
        </Col>
      </Row>
      <Card>
        <Card.Header title='我的工作' />
        <Card.Body />
      </Card>
    </>
  );
};

export default User;
