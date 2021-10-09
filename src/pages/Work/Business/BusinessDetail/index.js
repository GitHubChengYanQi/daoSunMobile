import React, { useState } from 'react';
import { Card, Collapse, List, NavBar, Result, Space, Tag } from 'antd-mobile';
import Icon, { LeftOutlined, UploadOutlined, UserOutlined, ZoomInOutlined } from '@ant-design/icons';
import { router } from 'umi';
import { Affix, Avatar, Col, Row, Select, Steps, Upload } from 'antd';
import { Button, Flex, FlexItem, Skeleton, TabPanel, Tabs, WhiteSpace } from 'weui-react-v2';
import { useRequest } from '../../../../util/Request';
import StepList from '../StepList';
import Dynamic from '../../Customer/Dynamic';
import TrackList from '../../Customer/TrackList';

const { Item } = List;

const BusinessDetail = () => {

  const params = window.location.href.split('?')[1];

  const { loading, data,refresh } = useRequest(
    {
      url: '/crmBusiness/detail',
      method: 'POST',
    }, {
      defaultParams: {
        data: {
          businessId: params,
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
        <Card
          title={
            <Space direction='horizontal' justify='center' align='center'>
              <Avatar
                shape='square'
                size={40}
                src={data.avatar}>{data.businessName && data.businessName.substring(0, 1)}</Avatar>
              <span>
                {data.businessName}
                <em style={{ display: 'block', fontWeight: 400 }}>客户：{data.customer && data.customer.customerName} / 负责人：{data.user && data.user.name}</em>
              </span>
            </Space>
          }
          extra={
            <Select size='small' placeholder='设置' style={{ width: 80 }} bordered={false} options={[
              {
                label:
                  <Button
                    size='small'
                    type='link'
                    style={{ padding: 0 }}
                    onClick={() => {
                      router.push(`/Work/Customer/Track?classify=1&customerId=${data.customerId}&businessId=${data.businessId}`);
                    }}>添加跟进</Button>
                , value: '0',
              },
              {
                label: <Button
                  style={{ padding: 0 }}
                  size='small'
                  type='link'
                  onClick={() => {
                    router.goBack();
                  }}>返回</Button>, value: '1',
              },
            ]} />
          }
        >
          <WhiteSpace size='md' />
          <Row gutter={24}>
            <Col span={12}>
              <div>立项日期：{data.time}</div>
            </Col>
            <Col span={12}>
              <div>合同名称：{data.contractResult ? data.contractResult.name : '暂无合同'}</div>
            </Col>
            <Col span={12}>
              <div>来源：{data.origin && data.origin.originName}</div>
            </Col>
          </Row>
        </Card>


        <StepList onChange={() => {
          refresh();
        }} value={data} />


        <Card style={{ backgroundColor: '#fff', marginTop: 8 }}>
          <Tabs className='swiper-demo2' lazy={true}>
            <TabPanel tabKey='1' tab={<span className='tab_point'>动态</span>}>
              <Dynamic api={{url:'/businessDynamic/list',method:'POST',data:{businessId:data.businessId || ''}}} />
            </TabPanel>
            <TabPanel tabKey='2' tab={<span className='tab_point'>跟进</span>}>
              <TrackList classifyId={data.businessId} classify={1} />
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
        </Card>
      </>
    );
  } else {
    return <Result
      status='error'
      title='无法完成操作'
      description='内容详情可折行，建议不超过两行建议不超过两行建议不超过两行'
    />;
  }

};

export default BusinessDetail;
