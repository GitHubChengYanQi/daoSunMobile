import React, { useState } from 'react';
import { Affix, Avatar, Col, Row, Select } from 'antd';
import { Button, Flex, FlexItem, ListItem, MultiUpload, Skeleton, TabPanel, Tabs, WhiteSpace } from 'weui-react-v2';
import Icon, { LeftOutlined, UploadOutlined, UserOutlined, ZoomInOutlined } from '@ant-design/icons';
import ContactsList from '../ContactsList';
import { router } from 'umi';
import { Card, Collapse, List, Tag } from 'antd-mobile';
import { useRequest } from '../../../../util/Request';
import Dynamic from '../Dynamic';
import Adress from '../Adress';
import TrackList from '../TrackList';
import CustomerUpload from '../Upload';
import Contract from '../../Contract';

const { Item } = List;

const CustomerDetail = () => {

  const params = window.location.href.split('?')[1];

  const { loading, data } = useRequest(
    {
      url: '/customer/detail',
      method: 'POST',
    }, {
      defaultParams: {
        data: {
          customerId: params,
        },
      },
    },
  );

  if (loading) {
    return <Skeleton loading={loading} />;
  }

  if (data) {
    return (
      <>
        <Card>
          <Row gutter={24}>
            <Col span={16}>
              <Card
                style={{ padding: 0 }}
                title={<strong style={{ fontSize: 16 }}>
                  {data.customerName}
                </strong>} />
              <WhiteSpace size='sm' />
              <em>公司地址：{data.signIn || '--'}&nbsp;&nbsp;/&nbsp;&nbsp;行业：{data.crmIndustryResult && data.crmIndustryResult.industryName || '--'}</em>
              <WhiteSpace size='sm' />
              法定代表人：{data.legal || '--'}&nbsp;&nbsp;/&nbsp;&nbsp;负责人：{data.userResult && data.userResult.name}
            </Col>
            <Col span={8} style={{ textAlign: 'center' }}>
              <Avatar shape='square' size={40}
                      src={data.avatar}>{data.customerName && data.customerName.substring(0, 1)}</Avatar>
              <div>
                <Select size='small' placeholder='设置' style={{ marginTop: 8,width:80 }} bordered={false}  options={[
                  { label:
                      <Button
                        size='small'
                        type='link'
                        style={{ padding: 0 }}
                        onClick={() => {
                          router.push('/Work/Customer/Track?0');
                        }}>添加跟进</Button>
                      , value: '0' },
                  { label: <Button
                      style={{ padding: 0 }}
                      size='small'
                      type='link'
                      onClick={() => {
                        router.goBack();
                      }}>返回</Button>, value: '1' },
                ]} />
              </div>
            </Col>
          </Row>
          <WhiteSpace size='md' />
          <div>
            <Row gutter={24}>
              <Col span={8}>
                客户级别：{data.crmCustomerLevelResult && data.crmCustomerLevelResult.level || '--'}
              </Col>
              <Col span={8}>
                客户状态：{data.status ? '正式客户' : '潜在客户'}
              </Col>
              <Col span={8}>
                客户分类：{!data.classification ? '代理商 ' : '终端客户'}
              </Col>
            </Row>
          </div>
          <WhiteSpace size='sm' />
          <div>客户归属：中国辽宁省沈阳市浑南区 创建时间：2021-10-1</div>
        </Card>
        <Card style={{ backgroundColor: '#fff', marginTop: 8 }}>
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
        </Card>
        <Collapse style={{ backgroundColor: '#fff', marginTop: 8 }}>
          <Collapse.Panel key='1' title='详细数据'>
            <Row gutter={24}>
              <Col span={12}>
                统一社会信用代码：{data.utscc}
              </Col>
              <Col span={12}>
                公司类型：{data.companyType}
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                成立时间：{data.setup}
              </Col>
              <Col span={12}>
                营业期限：{data.businessTerm}
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                客户来源：{data.originResult && data.originResult.originName}
              </Col>
              <Col span={12}>
                邮箱：{data.emall}
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                网址：{data.url}
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                公司简介：{data.introduction}
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                备注：{data.note}
              </Col>
            </Row>
          </Collapse.Panel>
        </Collapse>
        <Card style={{ backgroundColor: '#fff', marginTop: 8 }}>
          <Tabs className='swiper-demo2' lazy={true}>
            <TabPanel tabKey='1' tab={<span className='tab_point'>动态</span>}>
              <Dynamic customerId={data.customerId} />
            </TabPanel>
            <TabPanel tabKey='4' tab={<span className='tab_point'>联系人</span>}>
              <ContactsList customerId={data.customerId} />
            </TabPanel>
            <TabPanel tabKey='5' tab={<span className='tab_point'>地址</span>}>
              <Adress customerId={data.customerId} />
            </TabPanel>
            <TabPanel tabKey='2' tab={<span className='tab_point'>跟进</span>}>
              <TrackList customerId={data.customerId} />
            </TabPanel>
            <TabPanel tabKey='3' tab={<span className='tab_point'>资料</span>}>
              <CustomerUpload customerId={data.customerId} />
            </TabPanel>
            <TabPanel tabKey='6' tab={<span className='tab_point'>合同</span>}>
              <Contract customerId={data.customerId} />
            </TabPanel>
            <TabPanel tabKey='7' tab={<span className='tab_point'>订单</span>}>

            </TabPanel>
          </Tabs>
        </Card>
      </>
    )
  } else {
    return null;
  }

};

export default CustomerDetail;
