import React, { useEffect, useState } from 'react';
import { Affix, Badge, Col, Row } from 'antd';
import { Button, Flex, FlexItem, List, ListItem, Spin, WingBlank } from 'weui-react-v2';
import { Card, NavBar, SearchBar } from 'antd-mobile';
import Icon, {
  EllipsisOutlined,
  FilterOutlined,
  LeftOutlined,
  UserAddOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons';
import { router } from 'umi';

const Competitor = () => {


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
        >竞争对手列表</NavBar>
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
              <SearchBar style={{backgroundColor:'#fff',border:'solid 1px #eee',borderRadius:100}} placeholder="搜索竞争对手" maxLength={8} />
            </Col>
            <Col span={4}>
              <Button type='link' style={{ paddingTop: 16 }} icon={<FilterOutlined />} onClick={()=>{
                // router.push('/Work/Business/Screening');
              }} />
            </Col>
          </Row>
        </div>
        <List style={{ margin: 0 }} title={<>竞争对手数量 <span style={{ color: 'red' }}>444</span></>}>
          <List>
            <ListItem onClick={()=>{
              // router.push('/Work/Business/BusinessDetail');
            }}>
              <ListItem style={{ padding: 0 }} extra={<Button type='link'>报价信息</Button>}><h3>麻豆传媒</h3></ListItem>
              <div>电话：1215315413</div>
              <div>邮箱：1211321@qq.com</div>
              <div>地址：辽宁省沈阳市浑南区</div>
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

export default Competitor;
