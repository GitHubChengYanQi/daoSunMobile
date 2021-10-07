import React from 'react';
import { ActionSheet, Button, Flex, FlexItem, List, ListItem, Spin, WhiteSpace, WingBlank } from 'weui-react-v2';
import { Affix, Col, Row, Select } from 'antd';
import { EllipsisOutlined, OrderedListOutlined, PhoneOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { router } from 'umi';
import { Card } from 'antd-mobile';
import { useRequest } from '../../../../util/Request';

const CustomerList = () => {


  const { loading, data } = useRequest({ url: '/customer/list', method: 'POST' });

  if (loading) {
    return (
      <div style={{ margin: 50, textAlign: 'center' }}>
        <Spin spinning={true} size='large' />
      </div>
    );
  }

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
      title: <Card title='请选择联系人' extra={<Button size='small' type='link'>下一页</Button>} />,
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
      <div style={{margin:8}}>客户数量 <span style={{ color: 'red' }}>{data && data.length}</span>家</div>
      {data && data.map((items, index) => {
        return (
          <List key={index}>
            <ListItem style={{ padding: 8 }} onClick={() => {
              router.push(`/Work/Customer/CustomerDetail?${items.customerId}`);
            }}>
              <ListItem style={{ padding: 0 }} extra={items.signIn}><h3>{items.customerName}</h3></ListItem>
              <WhiteSpace size='md' />
              <Row gutter={24}>
                <Col span={16}>
                  <em>
                    {items.classificationName || '--'}
                    &nbsp;&nbsp;/&nbsp;&nbsp;
                    {items.status ? '正式客户' : '潜在客户'}
                    &nbsp;&nbsp;/&nbsp;&nbsp;
                    {items.crmIndustryResult && items.crmIndustryResult.industryName || '--'}
                    &nbsp;&nbsp;/&nbsp;&nbsp;
                    {items.companyType || '--'}
                  </em>
                </Col>
                <Col span={8}>
                  负责人:{items.userResult ? items.userResult.name : '--'}
                </Col>
              </Row>
              <WhiteSpace size='md' />
              <Row gutter={24}>
                <Col span={8}>
                  来源：{items.originResult ? items.originResult.originName : '---'}
                </Col>
                <Col span={8}>
                  级别:{items.crmCustomerLevelResult ? items.crmCustomerLevelResult.level : '--'}
                </Col>
                <Col span={8}>
                  创建时间:{items.createTime}
                </Col>
              </Row>
              <WhiteSpace size='md' />
              <Row gutter={24}>
                <Col span={6}>
                  商机:{items.businessCount}
                </Col>
                <Col span={6}>
                  跟进:{items.dynamicCount}
                </Col>
                <Col span={6}>
                  合同:{items.contracrCount}
                </Col>
                <Col span={6}>
                  人员:{items.contactsCount}
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
        );
      })}
    </>
  );
};

export default CustomerList;
