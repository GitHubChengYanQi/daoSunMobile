import React, { useImperativeHandle, useState } from 'react';
import { Button, Card, Dialog, Form, Popup, Selector, Space } from 'antd-mobile';
import { DatePicker, Input, ListItem, TextArea } from 'weui-react-v2';
import { UserIdSelect } from '../../../../Customer/CustomerUrl';
import { useRequest } from '../../../../../../util/Request';

const { Item: FormItem } = Form;

export const Users = ({ onChange }) => {

  const { data } = useRequest(UserIdSelect);

  const [userIds, setUserIds] = useState([]);

  const [usersVisabled, setUsersVisabled] = useState(false);

  const userName = userIds.map((items, index) => {
    return items.label;
  });

  return <>
    <Input placeholder={'请选择分派人'} value={userIds.length > 0 && userName.toString()} onFocus={() => {
      setUsersVisabled(true);
    }} />
    <Popup
      visible={usersVisabled}
      position='right'
      bodyStyle={{ minWidth: '60vw' }}
    >
      <div style={{ padding: 16 }}>
        <div style={{maxHeight:'70vh',overflowY:'auto'}}>
          <Selector
            value={userIds.map((items) => {
              return items.value;
            })}
            columns={1}
            options={data || []}
            multiple={true}
            onChange={(arr, extend) => {
              typeof onChange === 'function' && onChange(arr);
              setUserIds(extend.items);
            }}
          />
        </div>
        <Space style={{ padding: 8, width: '100%' }} justify='center'>
          <Button onClick={() => {
            setUserIds([]);
            setUsersVisabled(false);
          }}>取消</Button>
          <Button color='primary' onClick={() => {
            setUsersVisabled(false);
          }}>保存</Button>
        </Space>
      </div>
    </Popup>
  </>;
};

const Dispatch = ({ qualityTaskId, qualityDetailIds, onSuccess }, ref) => {

  const [visible, setVisiable] = useState(false);

  const { loading, run } = useRequest({
    url: '/qualityTaskDetail/addDetails',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: () => {
      typeof onSuccess === 'function' && onSuccess();
    },
  });

  useImperativeHandle(ref, () => ({
    setVisiable,
  }));

  return <Dialog
    visible={visible}
    content={<>
      <Form
        onFinish={async (values) => {

          console.log(JSON.stringify({
            ...values, userIds: values.userIds.toString(), detailsIds: qualityDetailIds, qualityTaskId,
          }));

          await run({
            data: {
              ...values, userIds: values.userIds.toString(), detailsIds: qualityDetailIds, qualityTaskId,
            },
          });
        }}
        footer={
          <Space justify='center' style={{ width: '100%' }}>
            <Button disabled={loading} color='default' onClick={() => {
              setVisiable(false);
            }}>取消</Button>
            <Button loading={loading} color='primary' type='submit'>保存</Button>
          </Space>
        }
      >
        <Card title='分派信息' bodyStyle={{ maxHeight: '50vh', overflow: 'auto' }}>
          <FormItem label='分派人' name='userIds' rules={[{ required: true, message: '该字段是必填字段！' }]}>
            <Users />
          </FormItem>
          <FormItem name='address' label='地点' rules={[{ required: true, message: '该字段是必填字段！' }]}>
            <Input placeholder='请输入分派地点' />
          </FormItem>
          <FormItem name='time' label='时间' rules={[{ required: true, message: '该字段是必填字段！' }]}>
            <DatePicker placeholder='请选择' defaultValue={null} useDefaultFormat={false} separator=''>
              <ListItem style={{ padding: 0 }} arrow={true} />
            </DatePicker>
          </FormItem>
          <FormItem name='person' label='对接人' rules={[{ required: true, message: '该字段是必填字段！' }]}>
            <Input placeholder='输入对接人' />
          </FormItem>
          <FormItem name='phone' label='联系方式' rules={[{ required: true, message: '该字段是必填字段！' }]}>
            <Input placeholder='输入联系方式' />
          </FormItem>
          <FormItem name='note' label='备注' >
            <TextArea placeholder='备注' />
          </FormItem>
        </Card>
      </Form>
    </>}
  />;
};

export default React.forwardRef(Dispatch);
