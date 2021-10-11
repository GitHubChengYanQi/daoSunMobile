import { Button, Flex, FlexItem, List, ListItem, Spin } from 'weui-react-v2';
import { router } from 'umi';
import { Card, InfiniteScroll } from 'antd-mobile';
import { Col, Row } from 'antd';
import { EllipsisOutlined, WhatsAppOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../util/Request';

let pages = 1;
let limit = 10;
let contents = [];

const BusinessList = ({select}) => {

  const [data, setData] = useState();

  const [hasMore, setHasMore] = useState(true)

  const { loading,run } = useRequest({
    url: '/crmBusiness/list',
    method: 'POST',
    data: {
      ...select,
    },
    params: {
      limit: limit,
      page: pages,
    },
  }, {
    debounceInterval: 500,
    refreshDeps: [select],
    onSuccess: (res) => {
      if (res && res.length > 0) {
        res.map((items, index) => {
          return contents.push(items);
        });
        setData(contents);
        ++pages;
      } else {
        setHasMore(false);
        if (pages === 1) {
          setData([]);
        }
      }
    },
  });


  useEffect(() => {
    pages = 1;
    contents = [];
  }, [select]);

  if (loading && pages === 1) {
    return (
      <div style={{ margin: 50, textAlign: 'center' }}>
        <Spin spinning={true} size='large' />
      </div>
    );
  }

  return (
    <>
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
                    router.push(`/Work/Customer/Track?classify=1&customerId=${data.customerId}&businessId=${data.businessId}`);
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
        return run({});
      }} hasMore={hasMore} />}
    </>
  );
};

export default BusinessList;
