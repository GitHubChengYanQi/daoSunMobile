import React from 'react';
import { Button, Flex, FlexItem, List, ListItem } from 'weui-react-v2';
import { Card } from 'antd';
import { router } from 'umi';

const Screening = () => {

  const Click = () => {
    router.goBack();
  };


  return (
    <>
      <List>
        <ListItem>
          <Card headStyle={{ border: 'none' }} title={<div style={{ textAlign: 'center' }}>客户状态</div>} bordered={false}>
            <Flex type='flex' justify='space-around'>
              <FlexItem><Button onClick={()=>{
                Click();
              }}>潜在客户</Button></FlexItem>
              <FlexItem><Button>正式客户</Button></FlexItem>
            </Flex>
          </Card>
        </ListItem>
        <ListItem>
          <Card headStyle={{ border: 'none' }} title={<div style={{ textAlign: 'center' }}>客户分类</div>} bordered={false}>
            <Flex type='flex' justify='space-around'>
              <FlexItem><Button>代理商</Button></FlexItem>
              <FlexItem><Button>终端用户</Button></FlexItem>
            </Flex>
          </Card>
        </ListItem>
        <ListItem>
          <Card headStyle={{ border: 'none' }} title={<div style={{ textAlign: 'center' }}>客户级别</div>} bordered={false}>
            <Flex type='flex' justify='space-around'>
              <FlexItem><Button>低</Button></FlexItem>
              <FlexItem><Button>中</Button></FlexItem>
              <FlexItem><Button>高</Button></FlexItem>
            </Flex>
          </Card>
        </ListItem>
        <ListItem style={{ textAlign: 'center' }}>
          <Button type='primary' style={{ marginRight: 16 }} onClick={() => {
            router.goBack();
          }}>确定</Button> <Button type='primary' onClick={() => {
          router.goBack();
        }}>返回</Button>
        </ListItem>
      </List>

    </>
  );
};

export default Screening;
