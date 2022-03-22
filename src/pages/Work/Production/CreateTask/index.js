import React from 'react';
import MyNavBar from '../../../components/MyNavBar';
import { Form } from 'antd-mobile';
import SelectUser from './components/SelectUser';
import StartEndDate from './components/StartEndDate';
import Users from './components/Users';

const CreateTask = () => {

  return <>
    <MyNavBar title='创建任务' />

    <Form
      onFinish={(value) => {
        console.log(value);
      }}
    >
      <Form.Item label='工序名称'>
        工序名称
      </Form.Item>
      <Form.Item name='userId' label='负责人'>
        <SelectUser />
      </Form.Item>
      <Form.Item name='date' label='执行时间' rules={[{ required: true }]}>
        <StartEndDate />
      </Form.Item>
      <Form.Item name='userIds' label='成员' rules={[{ required: true }]}>
        <Users />
      </Form.Item>
    </Form>
  </>;
};

export default CreateTask;
