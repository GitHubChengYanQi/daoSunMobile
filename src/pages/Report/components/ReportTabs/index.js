import React from 'react';
import { Avatar, Card, Progress, Switch, Table, Tabs } from 'antd';
import styles from '../../index.css';
import { Grid, GridItem, List, ListItem } from 'weui-react-v2';
import { UserOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Column } = Table;

const ReportTabs = () => {

  return (
    <>
      <Tabs
        style={{ padding: '0 24px' }}
        tabBarExtraContent={
          <>
            <Switch
              checkedChildren='已隐藏无数据人员'
              unCheckedChildren='隐藏无数据人员'
            />
          </>
        }>
        <TabPane tab='工单' key='1'>
          <Card style={{ backgroundColor: '#6be4c3',color:'#fff'}}>
              <div style={{textAlign:'center'}}>完成排行榜</div>
                <div style={{textAlign:'center',display:'inline-block',width:'33.33%',paddingTop:16}}><Avatar size={32}>2</Avatar><div>张苗苗</div></div>
                <div style={{textAlign:'center',display:'inline-block',width:'33.33%',paddingTop:16}}><Avatar size={40}>1</Avatar><div>李晓亮</div></div>
                <div style={{textAlign:'center',display:'inline-block',width:'33.33%',paddingTop:16}}><Avatar size={24}>3</Avatar><div>大金</div></div>
          </Card>
          <Table pagination={false} dataSource={[
            {
              key: '1',
              name: <>李晓亮</>,
              no: 11,
              add: 32,
              yes: '45',
            },
            {
              key: '2',
              name: <>张苗苗</>,
              no: 22,
              add: 33,
              yes: 21,
            },
            {
              key: '3',
              no: 1,
              name: <>大金</>,
              add: 62,
              yes: 22,
            },
          ]}>
            <Column dataIndex='key' />
            <Column title={<div>人员</div>} dataIndex='name' />
            <Column title={<div>未完成</div>} dataIndex='no' />
            <Column title={<di>新增</di>} dataIndex='add' />
            <Column title={<div>完成</div>} dataIndex='yes' />
          </Table>
        </TabPane>
        <TabPane tab='营收' key='2'>
          <Card style={{ backgroundColor: '#6be4c3',color:'#fff'}} bodyStyle={{padding:8}}>
            <div style={{textAlign:'center'}}>创收排行榜</div>
            <div style={{textAlign:'center',display:'inline-block',width:'33.33%',paddingTop:16}}><Avatar size={32}>2</Avatar><div>张苗苗</div></div>
            <div style={{textAlign:'center',display:'inline-block',width:'33.33%',paddingTop:16}}><Avatar size={40}>1</Avatar><div>李晓亮</div></div>
            <div style={{textAlign:'center',display:'inline-block',width:'33.33%',paddingTop:16}}><Avatar size={24}>3</Avatar><div>大金</div></div>
          </Card>
          <Table showHeader={false} pagination={false} dataSource={[
            {
              key: '1',
              name: <>李晓亮</>,
              money: '5500.00元',
            },
            {
              key: '2',
              name: <>张苗苗</>,
              money: '2340.00元',
            },
            {
              key: '3',
              name: <>大金</>,
              money: '1123.00元',
            },
          ]}>
            <Column dataIndex='key' />
            <Column dataIndex='name' />
            <Column dataIndex='money' align='right' />
          </Table>
        </TabPane>
        <TabPane tab='效率' key='3'>
          <Card style={{ backgroundColor: '#6be4c3',color:'#fff'}} bodyStyle={{padding:8}}>
            <div style={{textAlign:'center'}}>效率排行榜</div>
            <div style={{textAlign:'center',display:'inline-block',width:'33.33%',paddingTop:16}}><Avatar size={32}>2</Avatar><div>张苗苗</div></div>
            <div style={{textAlign:'center',display:'inline-block',width:'33.33%',paddingTop:16}}><Avatar size={40}>1</Avatar><div>李晓亮</div></div>
            <div style={{textAlign:'center',display:'inline-block',width:'33.33%',paddingTop:16}}><Avatar size={24}>3</Avatar><div>大金</div></div>
          </Card>
          <Table pagination={false} dataSource={[
            {
              key: '1',
              name: <>李晓亮</>,
              time:2
            },
            {
              key: '2',
              name: <>张苗苗</>,
              time:4
            },
            {
              key: '3',
              name: <>大金</>,
              time:5.6
            },
          ]}>
            <Column dataIndex='key' />
            <Column title={<div>人员</div>} dataIndex='name' />
            <Column title={<div>平均工单用时(小时)</div>} dataIndex='time' align='right' />
          </Table>
        </TabPane>
        <TabPane tab='满意度' key='4'>
          <Card style={{ backgroundColor: '#6be4c3',color:'#fff'}} bodyStyle={{padding:8}}>
            <div style={{textAlign:'center'}}>创收排行榜</div>
            <div style={{textAlign:'center',display:'inline-block',width:'33.33%',paddingTop:16}}><Avatar size={32}>2</Avatar><div>张苗苗</div></div>
            <div style={{textAlign:'center',display:'inline-block',width:'33.33%',paddingTop:16}}><Avatar size={40}>1</Avatar><div>李晓亮</div></div>
            <div style={{textAlign:'center',display:'inline-block',width:'33.33%',paddingTop:16}}><Avatar size={24}>3</Avatar><div>大金</div></div>
          </Card>
          <Table showHeader={false} pagination={false} dataSource={[
            {
              key: '1',
              name: <>李晓亮</>,
              satisfied: 24,
            },
            {
              key: '2',
              name: <>张苗苗</>,
              satisfied: 12,
            },
            {
              key: '3',
              name: <>大金</>,
              satisfied: 9,
            },
          ]}>
            <Column dataIndex='key' />
            <Column dataIndex='name' />
            <Column dataIndex='satisfied' align='left' render={(value)=>{
              return (
                <><Progress steps={10} percent={value} /></>
              );
            }} />
          </Table>
        </TabPane>
      </Tabs>
    </>
  );
};

export default ReportTabs;
