import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../util/Request';
import { Button, Flex, FlexItem, List, ListItem, Spin } from 'weui-react-v2';
import { Card, InfiniteScroll } from 'antd-mobile';
import { Affix, Badge, Col, Row } from 'antd';
import { EllipsisOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { router } from 'umi';

let pages = 1;
let limit = 10;
let contents = [];

const ContractList = ({select,customerId}) => {

  const [data, setData] = useState();

  const [hasMore, setHasMore] = useState(true)

  const { loading,run } = useRequest({
    url: '/contract/list',
    method: 'POST',
    data: {
      ...select,
      partyA:customerId
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
      {!customerId && <Affix offsetTop={70}><List style={{ margin: 0 }} title={<>合同数量 <span style={{ color: 'red' }}>{data && data.length}</span></>} /></Affix>}
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
      {data && <InfiniteScroll loadMore={() => {
        return run({});
      }} hasMore={hasMore} />}
    </>
  );
};

export default ContractList;
