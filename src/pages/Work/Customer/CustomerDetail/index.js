import React, { useState } from 'react';
import { Card, List, NavBar, Tag, WingBlank } from 'antd-mobile';
import { Avatar, Col, Row, Select, Upload } from 'antd';
import { Button, Flex, FlexItem, ListItem, MultiUpload, TabPanel, Tabs, WhiteSpace } from 'weui-react-v2';
import Icon, { LeftOutlined, UploadOutlined, UserOutlined, ZoomInOutlined } from '@ant-design/icons';
import ContactsList from '../ContactsList';
import { router } from 'umi';
import { useBoolean } from 'ahooks';

const {Item} = List;

const CustomerDetail = () => {

  const [selected, setSelected] = useState('1');

  return (
    <>
      <NavBar
        mode="light"
        icon={<LeftOutlined />}
        onLeftClick={() => router.goBack()}
        rightContent={[
          <Icon key="0" type="search" style={{ marginRight: '16px' }} />,
          <Icon key="1" type="ellipsis" />,
        ]}
      >客户详情</NavBar>
      <Card>
        <Card.Body>
          <Row gutter={24}>
            <Col span={16}>
              <Card.Header style={{padding:0}} title={<strong style={{fontSize:16}}>道昕智造<Button size='small' type='link' onClick={()=>{
                router.push('/Work/Customer/Track?0');
              }}>添加跟进</Button></strong>} />
              <WhiteSpace size='md' />
              <div>辽宁省沈阳市浑南区</div>
              <WhiteSpace size='md' />
              <Tag selected={selected === '0'} style={{marginRight:8}} onChange={(value)=>{
                if (value){
                  setSelected('0');
                }
              }}>代理商</Tag>
              <Tag selected={selected === '1'} onChange={(value)=>{
                if (value){
                  setSelected('1');
                }

              }}>终端用户</Tag>
            </Col>
            <Col span={8} style={{ textAlign: 'center' }}>
              <Avatar shape='square' size={40}>LOGO</Avatar>
              <Select size='small' style={{ width: '100%', marginTop: 8 }} defaultValue={['0']} options={[
                { label: '客户维护', value: '0' },
                { label: '需求跟踪', value: '1' },
                { label: '帐期跟踪', value: '2' },
              ]} />
            </Col>
          </Row>
          <WhiteSpace size='md' />
          <div>客户归属：中国辽宁省沈阳市浑南区 创建时间：2021-10-1</div>
        </Card.Body>
      </Card>
      <Card.Body style={{ backgroundColor: '#fff', marginTop: 8 }}>
        <Flex type='flex' justify='space-around'>
          <FlexItem span={4}>
            <div style={{ color: 'red' }}>110万元</div>
            <div>合同金额</div>
          </FlexItem>
          <FlexItem span={4}>
            <div style={{ color: 'red' }}>10台</div>
            <div>设备数量</div>
          </FlexItem>
          <FlexItem span={4}>
            <div style={{ color: 'red' }}>终端客户</div>
            <div>客户状态</div>
          </FlexItem>
          <FlexItem span={4}>
            <div style={{ color: 'red' }}>高</div>
            <div>客户级别</div>
          </FlexItem>
        </Flex>
      </Card.Body>
      <Card.Body style={{ backgroundColor: '#fff', marginTop: 8 }}>
        <Tabs className="swiper-demo2" lazy={true}>
          <TabPanel tabKey="1" tab={<span className="tab_point">动态</span>}>
            <List>
              <Item extra="2021-10-1 10:30" wrap align="top" thumb={<Avatar icon={<UserOutlined size={64} />} />} multipleLine>
                User <Item.Brief>操作</Item.Brief>
              </Item>
              <Item extra="2021-10-1 10:30" wrap align="top" thumb={<Avatar icon={<UserOutlined size={64} />} />} multipleLine>
                User <Item.Brief>操作</Item.Brief>
              </Item>
              <Item extra="2021-10-1 10:30" wrap align="top" thumb={<Avatar icon={<UserOutlined size={64} />} />} multipleLine>
                User <Item.Brief>操作</Item.Brief>
              </Item>
            </List>
          </TabPanel>
          <TabPanel tabKey="4" tab={<span className="tab_point">联系人</span>}>
              <ContactsList />
          </TabPanel>
          <TabPanel tabKey="5" tab={<span className="tab_point">地址</span>}>
            <List>
              <Item extra={<ZoomInOutlined />} align="top">
                辽宁省沈阳市浑南区
              </Item>
            </List>
          </TabPanel>
          <TabPanel tabKey="2" tab={<span className="tab_point">跟进</span>}>
            <List>
              <Item extra="2021-10-1 10:30" align="top" wrap thumb={<Avatar icon={<UserOutlined size={64} />} />} multipleLine>
                User <Item.Brief>内容</Item.Brief>
              </Item>
              <Item extra="2021-10-1 10:30" align="top" wrap thumb={<Avatar icon={<UserOutlined size={64} />} />} multipleLine>
                User <Item.Brief>内容</Item.Brief>
              </Item>
              <Item extra="2021-10-1 10:30" align="top" wrap thumb={<Avatar icon={<UserOutlined size={64} />} />} multipleLine>
                User <Item.Brief>内容</Item.Brief>
              </Item>
              <Item extra="2021-10-1 10:30" align="top" wrap thumb={<Avatar icon={<UserOutlined size={64} />} />} multipleLine>
                User <Item.Brief>内容</Item.Brief>
              </Item>
            </List>
          </TabPanel>
          <TabPanel tabKey="3" tab={<span className="tab_point">资料</span>}>
            <Upload
              listType="picture"
              // defaultFileList={[...fileList]}
            >
              <Button type='dashed' icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </TabPanel>
          <TabPanel tabKey="6" tab={<span className="tab_point">合同</span>}>

          </TabPanel>
          <TabPanel tabKey="7" tab={<span className="tab_point">订单</span>}>

          </TabPanel>
        </Tabs>
      </Card.Body>
    </>
  );
};

export default CustomerDetail;
