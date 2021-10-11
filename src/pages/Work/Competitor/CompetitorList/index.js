import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../util/Request';
import { Button, Flex, FlexItem, List, ListItem, Spin } from 'weui-react-v2';
import { EllipsisOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { Card, InfiniteScroll } from 'antd-mobile';

let pages = 1;
let limit = 10;
let contents = [];

const CompetitorList = ({ select }) => {

  const [data, setData] = useState();

  const [hasMore, setHasMore] = useState(true)

  const { loading,run } = useRequest({
    url: '/competitor/list',
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
      {!(select && select.businessId) && <List style={{ margin: 0 }} title={<>竞争对手数量 <span style={{ color: 'red' }}>{data && data.length}</span></>} />}
      {data && data.map((items, index) => {
        return (
          <List key={index}>
            <ListItem onClick={() => {
              // router.push('/Work/Business/BusinessDetail');
            }}>
              <Card extra={<div>竞争项目: <Button type='link'>{items.crmBusinessList.length > 0 && items.crmBusinessList[0].businessName}</Button></div>} title={items.name}>
                <div>级别：{items.level}</div>
                <div>电话：{items.phone}</div>
                <div>邮箱：{items.email}</div>
                <div>地址：{
                  items.regionResult ? `${items.regionResult.countries
                  }-${items.regionResult.province
                  }-${items.regionResult.city
                  }-${items.regionResult.area}` : '---'}</div>
              </Card>
            </ListItem>
            <ListItem>
              <Flex type='flex' justify='space-around'>
                <FlexItem>
                  <Button type='link' style={{ padding: 0 }} icon={<WhatsAppOutlined />} onClick={() => {
                    // router.push('/Work/Customer/Track?2');
                  }}> 报价信息</Button>
                </FlexItem>
                <FlexItem>
                  <Button type='link' style={{ padding: 0 }} icon={<EllipsisOutlined />} onClick={() => {
                    // router.push('/Work/Business/BusinessDetail');
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

export default CompetitorList;
