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
          <Card headStyle={{ border: 'none'}} title={<div style={{ textAlign: 'center' }}>完单状态</div>} bodyStyle={{padding:0}} bordered={false}>
            <Flex type='flex' justify='space-around'>
              <FlexItem><Button onClick={()=>{
                Click();
              }}>赢单</Button></FlexItem>
              <FlexItem><Button>输单</Button></FlexItem>
            </Flex>
          </Card>
        </ListItem>
        <ListItem>
          <Card headStyle={{ border: 'none' }} title={<div style={{ textAlign: 'center' }}>项目流程</div>} bodyStyle={{padding:0}} bordered={false}>
            <Flex type='flex' justify='space-around'>
              <FlexItem><Button>流程1</Button></FlexItem>
              <FlexItem><Button>流程2</Button></FlexItem>
              <FlexItem><Button>流程3</Button></FlexItem>
              <FlexItem><Button>流程4</Button></FlexItem>
            </Flex>
          </Card>
        </ListItem>
        <ListItem>
          <Card headStyle={{ border: 'none' }} title={<div style={{ textAlign: 'center' }}>项目来源</div>} bodyStyle={{padding:0}} bordered={false}>
            <Flex type='flex' justify='space-around'>
              <FlexItem><Button>来源1</Button></FlexItem>
              <FlexItem><Button>来源2</Button></FlexItem>
              <FlexItem><Button>来源3</Button></FlexItem>
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
