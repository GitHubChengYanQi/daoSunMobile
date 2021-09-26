import React from 'react';
import { List, ListItem, SafeArea, WingBlank } from 'weui-react-v2';
import { Avatar, Badge } from 'antd';


const Notice = () => {

  return (
    <div>
        <WingBlank size='sm'>
          <List>
            <ListItem
              access
              thumb={<Avatar size={40}>LOGO</Avatar>}
              extra={
                <>
                  <div>2121-9-24 11:00</div>
                  <Badge count={25} size={'small'} />
                </>
              }>
              <div style={{ fontWeight: 900, }}>客户分配通知</div>
              <div>有新客户需要沟通</div>
            </ListItem>
            <ListItem
              access
              thumb={<Avatar size={40}>LOGO</Avatar>}
              extra={
                <>
                  <div>2121-9-24 11:00</div>
                  <Badge count={18} />
                </>
              }>
              <div style={{ fontWeight: 900 }}>客户动态通知</div>
              <div>客户行为动态</div>
            </ListItem>
            <ListItem
              access
              thumb={<Avatar size={40}>LOGO</Avatar>}
              extra={
                <>
                  <div>2121-9-24 11:00</div>
                  <Badge count={3} />
                </>
              }>
              <div style={{ fontWeight: 900 }}>维保服务通知</div>
              <div>维保服务流转通知</div>
            </ListItem>
          </List>
        </WingBlank>
    </div>
  );
};

export default Notice;
