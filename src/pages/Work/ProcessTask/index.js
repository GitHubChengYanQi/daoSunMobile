import React, { useState } from 'react';
import { SafeArea, TabBar } from 'antd-mobile';
import { AuditOutlined, SendOutlined, UpCircleOutlined } from '@ant-design/icons';
import MyStart from './MyStart';


const ProcessTask = () => {

  const [key, setKey] = useState('start');

  const module = () => {
    switch (key) {
      case 'start':
        return <>
          <MyStart />
        </>;
      case 'audit':
        return <>

        </>;
      case 'send':
        return <>3</>;
      default:
        break;
    }
  };

  return <>
    {module()}
    <div
      style={{
        width: '100%',
        paddingBottom: 0,
        position: 'fixed',
        bottom: 0,
        backgroundColor: '#fff',
      }}>
      <TabBar
        onChange={(value) => {
          setKey(value);
        }}
      >
        <TabBar.Item key='start' icon={<UpCircleOutlined />} title='我发起的' />
        <TabBar.Item key='audit' icon={<AuditOutlined />} title='我审批的' />
        <TabBar.Item key='send' icon={<SendOutlined />} title='我抄送的' />
      </TabBar>
      <SafeArea position='bottom' />
    </div>
  </>;
};

export default ProcessTask;
