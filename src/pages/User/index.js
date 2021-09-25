import React from 'react';
import { Button, Preview, PreviewItem } from 'weui-react-v2';
import { Avatar, Card, Col, Row } from 'antd';


const User = () => {

  return (
    <>
      <Row gutter={24} style={{backgroundColor:'#fff'}}>
        <Col span={18}>
          <Preview style={{padding:16}} subTitle={<strong>程彦祺</strong>} title={<Button style={{ padding: 0 }} type='link'>设置工作状态</Button>} align='left'>
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
        <Col span={6} style={{textAlign:'center'}}>
          <Avatar size={64} style={{margin:'16px 0'}}>LOGO</Avatar>
          <div>个人设置</div>
        </Col>
      </Row>
      <Card title='我的工作'>

      </Card>
    </>
  );
};

export default User;
