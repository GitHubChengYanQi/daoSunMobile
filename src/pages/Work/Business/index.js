import React, { useEffect, useState } from 'react';
import {
  Button,
  Flex,
  FlexItem,
  List,
  ListItem,
  Spin,
} from 'weui-react-v2';
import {
  EllipsisOutlined,
  FilterOutlined,
  UserAddOutlined, WhatsAppOutlined,
} from '@ant-design/icons';
import { router } from 'umi';
import { Affix, Col, Row } from 'antd';
import { Card, InfiniteScroll, Search } from 'antd-mobile';
import { useRequest } from '../../../util/Request';

let page = 1;
let limit = 10;
let contents = [];

const Business = () => {

  const [data, setData] = useState();

  const [hasMore, setHasMore] = useState(true);

  const { loading, run } = useRequest({ url: '/crmBusiness/list', method: 'POST' }, {
    manual: true,
    debounceInterval: 500,
    onSuccess: (res) => {
      if (res && res.length > 0) {
        res.map((items, index) => {
          return contents.push(items);
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
      data: {},
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

  return (
    <>
      <div style={{ backgroundColor: '#fff' }}>
        <Row gutter={24} style={{ padding: 8 }}>
          <Col span={4}>
            <Button type='link' style={{ paddingTop: 16 }} icon={<UserAddOutlined />} onClick={() => {
              router.push('/Work/Business/BusinessAdd');
            }} />
          </Col>
          <Col span={16}>
            <Search style={{ backgroundColor: '#fff', border: 'solid 1px #eee', borderRadius: 100 }}
                    placeholder='搜索项目' maxLength={8} />
          </Col>
          <Col span={4}>
            <Button type='link' style={{ paddingTop: 16 }} icon={<FilterOutlined />} onClick={() => {
              router.push('/Work/Business/Screening');
            }} />
          </Col>
        </Row>
      </div>
      <List style={{ margin: 0 }} title={<>项目数量 <span style={{ color: 'red' }}>{data && data.length}</span></>} />
      {data && data.map((items,index)=>{
        return (
          <List key={index}>
            <ListItem onClick={() => {
              router.push(`/Work/Business/BusinessDetail?${items.businessId}`);
            }}>
              <Card style={{ padding: 0 }} extra={items.customer ? items.customer.customerName : null} title={items.businessName}>
                <Row gutter={24}>
                  <Col span={8}>
                    负责人:{items.user ? items.user.name : '未填写'}
                  </Col>
                  <Col span={8}>
                    机会来源:{items.origin ? items.origin.originName : null}
                  </Col>
                  <Col span={8}>
                    立项日期：{items.time}
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={8}>
                    盈率：{items.process && `${items.process.percentage}` || items.sales && items.sales.process.length > 0 && items.sales.process[0].percentage}
                  </Col>
                  <Col span={8}>
                    项目金额：{items.opportunityAmount}
                  </Col>
                </Row>
              </Card>
            </ListItem>
            <ListItem>
              <Flex type='flex' justify='space-around'>
                <FlexItem>
                  <Button type='link' style={{ padding: 0 }} icon={<WhatsAppOutlined />} onClick={() => {
                    router.push('/Work/Customer/Track?1');
                  }}> 跟进</Button>
                </FlexItem>
                <FlexItem>
                  <Button type='link' style={{ padding: 0 }} icon={<EllipsisOutlined />} onClick={() => {
                    router.push('/Work/Business/BusinessDetail');
                  }}> 更多</Button></FlexItem>
              </Flex>
            </ListItem>
          </List>
        );
      })}
      {data && <InfiniteScroll loadMore={() => {
        refresh(page);
      }} hasMore={hasMore} />}
    </>
  );
};

export default Business;
