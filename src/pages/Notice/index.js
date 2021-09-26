import React from 'react';
import { List, ListItem } from 'weui-react-v2';
import { Affix, Avatar } from 'antd';
import { Badge, NavBar } from 'antd-mobile';
import { router } from 'umi';


const Notice = () => {

  return (
    <div>
      <Affix offsetTop={0}>
        <NavBar
          mode='light'
        >通知</NavBar>
      </Affix>
      <>
        <List>
          <ListItem
            onClick={()=>{
              router.push('/Notice/Distribution')
            }}
            access
            thumb={<Avatar size={40}>LOGO</Avatar>}
            extra={
              <>
                <div>2121-9-24 11:00</div>
                <Badge text={25} />
              </>
            }>
            <div style={{ fontWeight: 900 }}>客户分配通知</div>
            <div>有新客户需要沟通</div>
          </ListItem>
          <ListItem
            access
            thumb={<Avatar size={40}>LOGO</Avatar>}
            extra={
              <>
                <div>2121-9-24 11:00</div>
                <Badge text={18} />
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
                <Badge text={3} />
              </>
            }>
            <div style={{ fontWeight: 900 }}>维保服务通知</div>
            <div>维保服务流转通知</div>
          </ListItem>
          <ListItem
            access
            thumb={<Avatar size={40}>LOGO</Avatar>}
            extra={
              <>
                <div>2121-9-24 11:00</div>
                <Badge text={25} />
              </>
            }>
            <div style={{ fontWeight: 900 }}>客户分配通知</div>
            <div>有新客户需要沟通</div>
          </ListItem>
          <ListItem
            access
            thumb={<Avatar size={40}>LOGO</Avatar>}
            extra={
              <>
                <div>2121-9-24 11:00</div>
                <Badge text={18} />
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
                <Badge text={3} />
              </>
            }>
            <div style={{ fontWeight: 900 }}>维保服务通知</div>
            <div>维保服务流转通知</div>
          </ListItem>
        </List>
      </>
    </div>
  );
};

export default Notice;
