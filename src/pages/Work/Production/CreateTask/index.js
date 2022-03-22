import React from 'react';
import MyNavBar from '../../../components/MyNavBar';
import { Form } from 'antd-mobile';
import SelectUser from './components/SelectUser';

const CreateTask = () => {

  return <>
    <MyNavBar title='创建任务' />

    <Form
      layout='horizontal'
      onFinish={(value) => {
        console.log(value);
      }}
    >
      <Form.Item label='工序名称'>
        工序名称
      </Form.Item>
      <Form.Item name='userId' label='负责人' rules={[{ required: true }]}>
        <SelectUser />
      </Form.Item>
    </Form>
  </>;
};

export default CreateTask;
