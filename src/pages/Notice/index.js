import React from 'react';
import { List, ListItem, SafeArea, WingBlank } from 'weui-react-v2';
import { WechatOutlined } from '@ant-design/icons';
import { Avatar, Badge } from 'antd';


const Notice = () => {

  return (
    <div>
      <SafeArea style={{ margin: '-0.16rem', minHeight: '100vh', backgroundColor: '#f4f4f4', padding: '5px 0 10px' }}>
        <WingBlank size='sm'>
          <List>
            <ListItem
              access
              style={{ padding: 16 }}
              thumb={<Avatar size={40}>LOGO</Avatar>}
              extra={
                <>
                  <div style={{ fontSize: 8 }}>2121-9-24 11:00</div>
                  <Badge count={25} />
                </>
              }>
              <div style={{ fontSize: 8, fontWeight: 900, marginBottom: 8 }}>客户分配通知</div>
              <div style={{ fontSize: 8 }}>有新客户需要沟通</div>
            </ListItem>
            <ListItem
              access
              style={{ padding: 16 }}
              thumb={<Avatar size={40}>LOGO</Avatar>}
              extra={
                <>
                  <div style={{ fontSize: 8 }}>2121-9-24 11:00</div>
                  <Badge count={18} />
                </>
              }>
              <div style={{ fontSize: 8, fontWeight: 900, marginBottom: 8 }}>客户动态通知</div>
              <div style={{ fontSize: 8 }}>客户行为动态</div>
            </ListItem>
            <ListItem
              access
              style={{ padding: 16 }}
              thumb={<Avatar size={40}>LOGO</Avatar>}
              extra={
                <>
                  <div style={{ fontSize: 8 }}>2121-9-24 11:00</div>
                  <Badge count={3} />
                </>
              }>
              <div style={{ fontSize: 8, fontWeight: 900, marginBottom: 8 }}>维保服务通知</div>
              <div style={{ fontSize: 8 }}>维保服务流转通知</div>
            </ListItem>
          </List>
        </WingBlank>
      </SafeArea>
    </div>
  );
};

export default Notice;
