import React, { useEffect, useState } from 'react';
import { Affix, Badge, Col, Row } from 'antd';
import { Button, Flex, FlexItem, List, ListItem, Spin, WingBlank } from 'weui-react-v2';
import Icon, { EllipsisOutlined, FilterOutlined, LeftOutlined, UserAddOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { router } from 'umi';
import { Card, NavBar, SearchBar } from 'antd-mobile';


const Contract = () => {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <Affix offsetTop={50} style={{textAlign:'center'}}>
        <Spin spinning={true} size='large' />
      </Affix>
    );
  }

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
        >合同列表</NavBar>
      </Affix>
      <WingBlank>
        <div style={{ backgroundColor: '#fff' }}>
          <Row gutter={24} style={{padding:8}}>
            <Col span={4}>
              <Button type='link' style={{ paddingTop: 16 }} icon={<UserAddOutlined />} onClick={() => {
                // router.push('/Work/Business/BusinessAdd');
              }} />
            </Col>
            <Col span={16}>
              <SearchBar style={{backgroundColor:'#fff',border:'solid 1px #eee',borderRadius:100}} placeholder="搜索合同" maxLength={8} />
            </Col>
            <Col span={4}>
              <Button type='link' style={{ paddingTop: 16 }} icon={<FilterOutlined />} onClick={()=>{
                // router.push('/Work/Business/Screening');
              }} />
            </Col>
          </Row>
        </div>
        <List style={{ margin: 0 }} title={<>合同数量 <span style={{ color: 'red' }}>333</span></>}>
          <List>
            <ListItem onClick={()=>{
              // router.push('/Work/Business/BusinessDetail');
            }}>
              <ListItem style={{ padding: 0 }} extra={<Badge color='red' text='未审核' />}><h3>SOLO</h3></ListItem>
              <Row gutter={24}>
                <Col span={12}>
                  <Card.Header title='甲方信息' />
                  <Card.Body>
                    <div>客户：影流之主</div>
                    <div>联系人：劫</div>
                    <div>电话：1779431325426</div>
                    <div>地址：暗影岛</div>
                  </Card.Body>
                </Col>
                <Col span={12}>
                  <Card.Header title='乙方信息' />
                  <Card.Body>
                    <div>客户：疾风剑豪</div>
                    <div>联系人：亚索</div>
                    <div>电话：12222222</div>
                    <div>地址：疾风亦有归途！</div>
                  </Card.Body>
                </Col>
              </Row>
            </ListItem>
            <ListItem>
              <Flex type='flex' justify='space-around'>
                <FlexItem>
                  <Button type='link' style={{ padding: 0 }} icon={<WhatsAppOutlined />} onClick={() => {
                    router.push('/Work/Customer/Track?2');
                  }}> 跟进</Button>
                </FlexItem>
                <FlexItem>
                  <Button type='link' style={{ padding: 0 }} icon={<EllipsisOutlined />} onClick={()=>{
                    // router.push('/Work/Business/BusinessDetail');
                  }}> 更多</Button></FlexItem>
              </Flex>
            </ListItem>
          </List>
        </List>
      </WingBlank>
    </>
  );
};

export default Contract;
