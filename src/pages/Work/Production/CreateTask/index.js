import React, { useRef } from 'react';
import MyNavBar from '../../../components/MyNavBar';
import { Button,  Form, TextArea } from 'antd-mobile';
import SelectUser from './components/SelectUser';
import StartEndDate from './components/StartEndDate';
import Users from './components/Users';
import Number from '../../../components/Number';
import MyCoding from '../../../components/MyCoding';
import { useRequest } from '../../../../util/Request';
import { MyLoading } from '../../../components/MyLoading';
import { Message } from '../../../components/Message';

const CreateTask = (props) => {

  const params = props.location.query;

  const { loading, run } = useRequest(
    { url: '/productionTask/add', method: 'POST' },
    {
      manual: true,
      onSuccess: () => {
        Message.dialogSuccess(
          '分派任务成功!',
          '返回工单',
          '继续分派任务',
          () => {

          },
        );
      },
      onError: (err) => {
       Message.toast('创建任务失败!')
      },
    });

  const ref = useRef();

  if (loading) {
    return <MyLoading />;
  }

  return <>
    <MyNavBar title='分派任务' />

    <Form
      ref={ref}
      onFinish={(value) => {
        run({
          data: {
            workOrderId: params.id,
            ...value,
            productionTime: value.date && value.date[0],
            endTime: value.date && value.date[1],
            userId: value.userId && value.userId.id,
            userIdList: value.userIdList && value.userIdList.map((item) => {
              return item.id;
            }),
          },
        });
      }}
    >
      <Form.Item name='coding' label='生产编码'>
        <MyCoding module={99} />
      </Form.Item>
      <Form.Item label='工序'>
        {params.shipName}
      </Form.Item>
      <Form.Item name='userId' label='负责人'>
        <SelectUser />
      </Form.Item>
      <Form.Item name='date' label='执行时间'>
        <StartEndDate />
      </Form.Item>
      <Form.Item name='userIdList' label='成员'>
        <Users />
      </Form.Item>
      <Form.Item name='number' label='生产数量' rules={[{ required: true, message: '请输入生产数量！' }]}>
        <Number noBorder placeholder='请输入生产数量' max={params.max} />
      </Form.Item>
      <Form.Item name='remake' label='备注'>
        <TextArea placeholder='请输入生产备注' />
      </Form.Item>
    </Form>

    <Button onClick={() => {
      ref.current.submit();
    }} style={{ position: 'sticky', bottom: 0 }} block type='submit' color='primary' size='large'>
      提交
    </Button>
  </>;
};

export default CreateTask;
