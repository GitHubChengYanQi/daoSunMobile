import React, { useState } from 'react';
import { Card, List, NavBar, Tag } from 'antd-mobile';
import Icon, { LeftOutlined, UploadOutlined, UserOutlined, ZoomInOutlined } from '@ant-design/icons';
import { router } from 'umi';
import { Affix, Avatar, Col, Row, Select, Steps, Upload } from 'antd';
import { Button, Flex, FlexItem, TabPanel, Tabs, WhiteSpace } from 'weui-react-v2';
import ContactsList from '../../Customer/ContactsList';

const BusinessDetail = () => {

  const [current, setCurrent] = useState(0);

  return (
    <>
      <Affix offsetTop={0}>
        <NavBar
          mode='light'
          icon={<LeftOutlined />}
          onLeftClick={() => router.goBack()}
          rightContent={[
            <Icon key='0' type='search' style={{ marginRight: '16px' }} />,
            <Icon key='1' type='ellipsis' />,
          ]}
        >项目详情</NavBar>
      </Affix>
      <Card>
        <Card.Body>
          <Row gutter={24}>
            <Col span={16}>
              <Card.Header style={{ padding: 0 }}
                           title={<strong style={{ fontSize: 16 }}>英雄联盟<Button size='small' type='link' onClick={() => {
                             router.push('/Work/Customer/Track?1');
                           }}>添加跟进</Button></strong>} />
              <WhiteSpace size='md' />
              <div>客户：无线乱斗 / 负责人：程彦祺</div>
              <WhiteSpace size='md' />
              <div>立项日期：2021-10-1</div>
            </Col>
            <Col span={8} style={{ textAlign: 'center' }}>
              <Avatar shape='square' size={40}>英</Avatar>
              <div>
                <Select size='small' style={{ marginTop: 8 }} defaultValue={['0']} options={[
                  { label: '设置', value: '0' },
                ]} />
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Card.Body style={{ backgroundColor: '#fff', marginTop: 8 }}>
        <Steps
          direction='vertical'
          type='navigation'
          size='small'
          current={current}
          onChange={(value) => {
            setCurrent(value);
          }}
          className='site-navigation-steps'
        >
          <Steps.Step title='验证客户' description='盈率：10%' />
          <Steps.Step title='需求确定' description='盈率：30%' />
          <Steps.Step title='方案/报价' description='盈率：60%' />
          <Steps.Step title='谈判审核' description='盈率：80%' />
          <Steps.Step title='完成' />
        </Steps>
      </Card.Body>
      <Card.Body style={{ backgroundColor: '#fff', marginTop: 8 }}>
        <Tabs className='swiper-demo2' lazy={true}>
          <TabPanel tabKey='1' tab={<span className='tab_point'>动态</span>}>
            <List>
              <List.Item extra='2021-10-1 10:30' wrap align='top' thumb={<Avatar icon={<UserOutlined size={64} />} />}
                         multipleLine>
                User <List.Item.Brief>操作</List.Item.Brief>
              </List.Item>
              <List.Item extra='2021-10-1 10:30' wrap align='top' thumb={<Avatar icon={<UserOutlined size={64} />} />}
                         multipleLine>
                User <List.Item.Brief>操作</List.Item.Brief>
              </List.Item>
              <List.Item extra='2021-10-1 10:30' wrap align='top' thumb={<Avatar icon={<UserOutlined size={64} />} />}
                         multipleLine>
                User <List.Item.Brief>操作</List.Item.Brief>
              </List.Item>
            </List>
          </TabPanel>
          <TabPanel tabKey='2' tab={<span className='tab_point'>跟进</span>}>
            <List>
              <List.Item extra='2021-10-1 10:30' align='top' wrap thumb={<Avatar icon={<UserOutlined size={64} />} />}
                         multipleLine>
                User <List.Item.Brief>内容</List.Item.Brief>
              </List.Item>
              <List.Item extra='2021-10-1 10:30' align='top' wrap thumb={<Avatar icon={<UserOutlined size={64} />} />}
                         multipleLine>
                User <List.Item.Brief>内容</List.Item.Brief>
              </List.Item>
              <List.Item extra='2021-10-1 10:30' align='top' wrap thumb={<Avatar icon={<UserOutlined size={64} />} />}
                         multipleLine>
                User <List.Item.Brief>内容</List.Item.Brief>
              </List.Item>
              <List.Item extra='2021-10-1 10:30' align='top' wrap thumb={<Avatar icon={<UserOutlined size={64} />} />}
                         multipleLine>
                User <List.Item.Brief>内容</List.Item.Brief>
              </List.Item>
            </List>
          </TabPanel>
          <TabPanel tabKey='4' tab={<span className='tab_point'>竞争对手</span>}>
            无敌是多么寂寞~！
          </TabPanel>
          <TabPanel tabKey='5' tab={<span className='tab_point'>报价</span>}>
            贫穷~
          </TabPanel>
          <TabPanel tabKey='3' tab={<span className='tab_point'>产品明细</span>}>
            666
          </TabPanel>
        </Tabs>
      </Card.Body>
    </>
  );

};

export default BusinessDetail;
