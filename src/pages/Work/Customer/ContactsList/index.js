import React from 'react';
import { ActionSheet, Button, Flex, FlexItem, List, ListItem, Spin } from 'weui-react-v2';
import { Affix, Avatar, Col, Row, Select } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';
import { router } from 'umi';
import { useRequest } from '../../../../util/Request';
import { Tag } from 'antd-mobile';

const ContactsList = () => {

  const { loading, data } = useRequest({ url: '/contacts/list', method: 'POST' });

  if (loading) {
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
        console.log(index);
        return new Promise((resolve, reject) => {
          resolve(true);
        });
      },
    });
  };

  return (
    <>
      <div style={{margin:8}}>联系人数量 <span style={{ color: 'red' }}>{data && data.length}</span>位</div>
      {data && data.map((items, index) => {
        return (
          <List key={index}>
            <Row gutter={24}>
              <Col span={4}>
                <Avatar style={{margin:16}} size={56}>{items.contactsName && items.contactsName.substring(0, 1)}</Avatar>
              </Col>
              <Col span={20}>
                <ListItem>
                  <ListItem style={{ padding: 0 }} extra={<Button onClick={() => {
                    Phones(items.contactsName, items.companyRoleResult && items.companyRoleResult.position, items.customerResults && items.customerResults.length > 0 && items.customerResults[0].customerName, items.phoneParams && items.phoneParams.length > 0 && items.phoneParams);
                  }} type='link' style={{ padding: 0 }} icon={<PhoneOutlined />}>拨打电话</Button>}>
                    <h3>{items.contactsName}</h3></ListItem>
                  <div>
                    {
                      items.customerResults && items.customerResults.length > 0 && items.customerResults[0].customerName
                    }
                  </div>
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
                  <div>
                    职务：{items.companyRoleResult && items.companyRoleResult.position}
                  </div>
                </ListItem>
              </Col>
            </Row>
          </List>
        );
      })}
    </>
  );
};

export default ContactsList;
