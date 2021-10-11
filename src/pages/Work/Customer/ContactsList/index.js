import React, { useEffect, useState } from 'react';
import { ActionSheet, Button, Flex, FlexItem, List, ListItem, Spin } from 'weui-react-v2';
import { Avatar, Col, Row } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';
import { useRequest } from '../../../../util/Request';
import { InfiniteScroll, Tag } from 'antd-mobile';

let pages = 1;
let limit = 10;
let contents = [];

const ContactsList = (props) => {

  const {customerId} = props;

  const [data, setData] = useState();

  const [hasMore, setHasMore] = useState(true)

  const { loading,run } = useRequest({
    url: '/contacts/list',
    method: 'POST',
    data: {
      customerId:customerId,
    },
    params: {
      limit: limit,
      page: pages,
    },
  }, {
    debounceInterval: 500,
    refreshDeps: [],
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
  }, []);

  if (loading && pages === 1) {
    return (
      <div style={{ margin: 50, textAlign: 'center' }}>
        <Spin spinning={true} size='large' />
      </div>
    );
  }

  const Phones = (name, job, customer, phones) => {
    ActionSheet({
      title: `${name} / ${job} / ${customer}`,
      menus: phones ? phones.map((items, index) => {
        return (
          <Flex key={index} type='flex' justify='space-around'>
            <FlexItem>{items.phoneNumber}</FlexItem>
          </Flex>
        );
      }) : [],
      onClick: (index) => {
        return new Promise((resolve, reject) => {
          resolve(true);
        });
      },
    });
  };

  return (
    <>
      {!customerId && <div style={{ margin: 8 }}>联系人数量 <span style={{ color: 'red' }}>{data && data.length}</span>位</div>}
      {data && data.map((items, index) => {
        return (
          <List key={index}>
            <Row gutter={24}>
              <Col span={4}>
                <Avatar style={{margin:14}} size={54}>{items.contactsName && items.contactsName.substring(0, 1)}</Avatar>
              </Col>
              <Col span={20}>
                <ListItem>
                  <ListItem style={{ padding: 0 }} extra={<Button onClick={() => {
                    Phones(items.contactsName, items.companyRoleResult && items.companyRoleResult.position, items.customerResults && items.customerResults.length > 0 && items.customerResults[0].customerName, items.phoneParams && items.phoneParams.length > 0 && items.phoneParams);
                  }} type='link' style={{ padding: 0 }} icon={<PhoneOutlined />}>拨打电话</Button>}>
                    <h3>{items.contactsName}</h3></ListItem>
                  <em>
                    {
                      items.customerResults && items.customerResults.length > 0 && items.customerResults[0].customerName
                    }
                    &nbsp;&nbsp;/&nbsp;&nbsp;职务：{items.companyRoleResult && items.companyRoleResult.position}
                  </em>
                  <div>手机号：{
                    items.phoneParams && items.phoneParams.length > 0 ? items.phoneParams.map((value, index) => {
                      return (
                        <Tag
                          key={index}
                          color='#06ad56'
                          style={{ marginRight: 3 }}
                        >
                          {value.phoneNumber}
                        </Tag>
                      );
                    }) : null
                  }</div>
                </ListItem>
              </Col>
            </Row>
          </List>
        );
      })}
      {data && <InfiniteScroll loadMore={() => {
        return run({});
      }} hasMore={hasMore} />}
    </>
  );
};

export default ContactsList;
