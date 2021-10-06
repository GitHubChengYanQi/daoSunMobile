import React from 'react';
import { Search, Tag } from 'antd-mobile';
import { ActionSheet, Button, Flex, FlexItem, List, ListItem, Preview, PreviewButton } from 'weui-react-v2';
import { PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import styles from './index.css';

const Distribution = () => {

  const Phones = () => {
    ActionSheet({
      title: '程彦祺/开发部长/开发部',
      menus: [
        <Flex type='flex' justify='space-around'>
          <FlexItem>固定电话</FlexItem>
          <FlexItem>17777777777</FlexItem>
        </Flex>,
        <Flex type='flex' justify='space-around'>
          <FlexItem>不固定电话</FlexItem>
          <FlexItem>18888888888</FlexItem>
        </Flex>,
      ],
      onClick: (index) => {
        return new Promise((resolve, reject) => {
          resolve(true);
        });
      },
    });
  };

  return (
    <>
      <div style={{ backgroundColor: '#fff', padding: 8 }}>
        <Search style={{ backgroundColor: '#fff', border: 'solid 1px #eee', borderRadius: 100 }}
                   placeholder='搜索项目'
                   maxLength={8} />
        <div style={{ marginTop: 8 }} className={styles.sea}>
          <Preview
            footer={[
              <PreviewButton key='a' >排序</PreviewButton>,
              <PreviewButton key='b'>
                筛选
              </PreviewButton>,
            ]}
          />
        </div>
      </div>
      <List>
        <ListItem thumb={<Avatar icon={<UserOutlined />} />} extra={<Button type='text' icon={<Avatar
          style={{ backgroundColor: 'green' }} icon={<PhoneOutlined onClick={() => {
          Phones();
        }} />} />} />}>
          <div style={{ display: 'inline-block' }}>
            content
            <br />
            2021-9-1 10:00:00
          </div>
          <div style={{
            float: 'right',
            border: 'solid 1px #1890ff',
            borderRadius: 16,
            padding: '4px 8px',
            margin: 8,
            color: '#1890ff',
          }}>
            来自：系统
          </div>
        </ListItem>
        <ListItem thumb={<Avatar icon={<UserOutlined />} />} extra={<Button type='text' icon={<Avatar
          style={{ backgroundColor: 'green' }} icon={<PhoneOutlined onClick={() => {
          Phones();
        }} />} />} />}>
          <div style={{ display: 'inline-block' }}>
            content
            <br />
            2021-9-1 10:00:00
          </div>
          <div style={{
            float: 'right',
            border: 'solid 1px #1890ff',
            borderRadius: 16,
            padding: '4px 8px',
            margin: 8,
            color: '#1890ff',
          }}>
            来自：系统
          </div>
        </ListItem>
        <ListItem thumb={<Avatar icon={<UserOutlined />} />}
                  extra={<Button type='text' icon={<Avatar icon={<PhoneOutlined />} />} />}>
          <div style={{ display: 'inline-block' }}>
            content
            <br />
            2021-9-1 10:00:00
          </div>
          <div style={{
            float: 'right',
            border: 'solid 1px #1890ff',
            borderRadius: 16,
            padding: '4px 8px',
            margin: 8,
            color: '#1890ff',
          }}>
            来自：系统
          </div>
        </ListItem>
      </List>
    </>
  );
};

export default Distribution;
