import React, { useEffect, useState } from 'react';
import { Affix, Badge, Col, Row } from 'antd';
import { Button, Flex, FlexItem, List, ListItem, Search, Skeleton, Spin, WingBlank } from 'weui-react-v2';
import Icon, {
  EllipsisOutlined,
  FilterOutlined,
  LeftOutlined,
  UserAddOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons';
import { router } from 'umi';
import { Card, InfiniteScroll } from 'antd-mobile';
import { useRequest } from '../../../util/Request';

let page = 1;
let limit = 10;
let contents = [];

const Contract = ({ customerId }) => {

  const [data, setData] = useState();

  const [hasMore, setHasMore] = useState(true);

  const { loading, run } = useRequest({ url: '/contract/list', method: 'POST' }, {
    manual: true,
    debounceInterval: 500,
    onSuccess: (res) => {
      if (res && res.length > 0) {
        res.map((items, index) => {
          contents.push(items);
        });
        ++page;
        setData(contents);
      } else {
        setHasMore(false);
      }
    },
  });


  const refresh = async (page) => {
    await run({
      data: {
        partyA: customerId || null
      },
      params: {
        limit: limit,
        page: page,
      },
    });
  };

  useEffect(() => {
    page = 1;
    contents = [];
    refresh(page);
  }, []);

  if (loading && page === 1) {
    return (
      <div style={{ margin: 50, textAlign: 'center' }}>
        <Spin spinning={true} size='large' />
      </div>
    );
  }


  if (data) {
    return (
      <>
        {!customerId &&
        <>
          <div style={{ backgroundColor: '#fff' }}>
            <Row gutter={24} style={{ padding: 8 }}>
              <Col span={4}>
                <Button type='link' style={{ paddingTop: 16 }} icon={<UserAddOutlined />} onClick={() => {
                  // router.push('/Work/Business/BusinessAdd');
                }} />
              </Col>
              <Col span={16}>
                <Search
                  style={{
                    backgroundColor: '#fff',
                    border: 'solid 1px #eee',
                    padding: '0 8px',
                    margin: 8,
                    borderRadius: 100,
                  }}
                  placeholder='搜索合同' maxLength={8} />
              </Col>
              <Col span={4}>
                <Button type='link' style={{ paddingTop: 16 }} icon={<FilterOutlined />} onClick={() => {
                  // router.push('/Work/Business/Screening');
                }} />
              </Col>
            </Row>
          </div>
          <List style={{ margin: 0 }} title={<>合同数量 <span style={{ color: 'red' }}>{data.length}</span></>} />
        </>}
        {
          data && data.map((items, index) => {
            return (
              <List key={index}>
                <ListItem onClick={() => {
                  // router.push('/Work/Business/BusinessDetail');
                }}>
                  <Card style={{ padding: 0 }} title={items.name}
                        extra={items.audit ? <Badge color='green' text='已审核' /> : <Badge color='red' text='未审核' />}>
                    <Row gutter={24}>
                      <Col span={12}>
                        <Card title='甲方信息'>
                          <div>客户：{items.partA ? items.partA.customerName : null}</div>
                          <div>联系人：{items.partyAContacts ? items.partyAContacts.contactsName : '--'}</div>
                          <div>电话：{items.phoneA ? items.phoneA.phoneNumber : '--'}</div>
                          <div>地址：{items.partyAAdress ? items.partyAAdress.location : '---'}</div>
                        </Card>
                      </Col>
                      <Col span={12}>
                        <Card title='乙方信息'>
                          <div>客户：{items.partB ? items.partB.customerName : null}</div>
                          <div>联系人：{items.partyBContacts ? items.partyBContacts.contactsName : '--'}</div>
                          <div>电话：{items.phoneB ? items.phoneB.phoneNumber : '--'}</div>
                          <div>地址：{items.partyAAdress ? items.partyAAdress.location : '---'}！</div>
                        </Card>
                      </Col>
                    </Row>
                  </Card>
                </ListItem>
                {!customerId && <ListItem>
                  <Flex type='flex' justify='space-around'>
                    <FlexItem>
                      <Button type='link' style={{ padding: 0 }} icon={<WhatsAppOutlined />} onClick={() => {
                        router.push('/Work/Customer/Track?2');
                      }}> 跟进</Button>
                    </FlexItem>
                    <FlexItem>
                      <Button type='link' style={{ padding: 0 }} icon={<EllipsisOutlined />} onClick={() => {
                        // router.push('/Work/Business/BusinessDetail');
                      }}> 更多</Button></FlexItem>
                  </Flex>
                </ListItem>}
              </List>
            );
          })
        }
        <InfiniteScroll loadMore={() => {
          refresh(page);
        }} hasMore={hasMore} />
      </>
    );
  } else {
    return null;
  }

};

export default Contract;
