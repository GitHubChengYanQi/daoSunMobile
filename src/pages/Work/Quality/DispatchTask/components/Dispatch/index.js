import React, { useImperativeHandle, useState } from 'react';
import { Button, Card, Dialog, Divider, Form, Popup, Selector, Space, Toast } from 'antd-mobile';
import { DatePicker, Input, ListItem, TextArea } from 'weui-react-v2';
import { UserIdSelect } from '../../../../Customer/CustomerUrl';
import { useRequest } from '../../../../../../util/Request';
import MyTreeSelect from '../../../../../components/MyTreeSelect';
import { router } from 'umi';
import Amap from '../../../../../../components/Amap';

const { Item: FormItem } = Form;

export const Users = ({ onChange }) => {

  const { data, run } = useRequest(UserIdSelect);

  const [userIds, setUserIds] = useState([]);

  const [deptId, setDeptId] = useState();

  const [usersVisabled, setUsersVisabled] = useState(false);

  const userName = userIds.map((items, index) => {
    return items.label;
  });

  return <>
    <Button
      style={{ padding: 0, width: '100%', textAlign: 'left' }}
      fill='none'
      onClick={() => {
        setUsersVisabled(true);
      }}>
      {userIds.length > 0 ? userName.toString() : <span style={{ color: '#cccccc' }}>请选择质检人</span>}
    </Button>
    <Popup
      visible={usersVisabled}
      position='right'
      bodyStyle={{ minWidth: '60vw' }}
    >
      <div style={{ padding: 16 }}>
        <MyTreeSelect
          title={<span style={{ color: '#ccc' }}>选择部门搜索</span>}
          value={deptId}
          api={
            {
              url: '/rest/dept/tree',
              method: 'POST',
            }
          }
          onChange={async (value) => {
            setDeptId(value);
            await run({
              data: {
                deptId: value,
              },
            });
          }} />
        <Divider />
        <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
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

const Dispatch = ({ detail, onSuccess }, ref) => {

  const [visible, setVisiable] = useState(false);

  const { loading, run } = useRequest({
    url: '/qualityTask/add',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: () => {
      Toast.show({
        content: '指派成功！',
        position: 'bottom',
      });
      router.push(`/Work/Quality?id=${detail.detail && detail.detail.qualityTaskId}`);
    },
    onError: () => {
      Toast.show({
        content: '指派失败！',
        position: 'bottom',
      });
      router.push(`/Work/Quality?id=${detail.detail && detail.detail.qualityTaskId}`);
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

          console.log(
            JSON.stringify(
              {
                taskParams: {
                  ...detail.detail,
                  ...values,
                  userIds: values.userIds.toString(),
                  details: detail.qualityLising,
                },
              },
            ),
          );

          await run({
            data: {
              state:1,
              parentId:detail.detail.qualityTaskId,
              ...values,
              userIds: values.userIds.toString(),
              details: detail.qualityLising,
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
        <Card title='指派信息' bodyStyle={{ maxHeight: '50vh', overflow: 'auto' }}>
          <FormItem label='质检人' name='userIds' rules={[{ required: true, message: '该字段是必填字段！' }]}>
            <Users />
          </FormItem>
          <FormItem name='address' label='地点'>
            <Amap title='选择地点' />
          </FormItem>
          <FormItem name='time' label='时间'>
            <DatePicker placeholder='请选择' defaultValue={null} useDefaultFormat={false} separator=''>
              <ListItem style={{ padding: 0 }} arrow={true} />
            </DatePicker>
          </FormItem>
          <FormItem name='person' label='联系人'>
            <Input placeholder='输入联系人' />
          </FormItem>
          <FormItem name='phone' label='联系方式' rules={[{
            message: '请输入正确的手机号码！',
            pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/,
          }]}>
            <Input placeholder='输入联系方式' />
          </FormItem>
          <FormItem name='note' label='备注'>
            <TextArea placeholder='备注' />
          </FormItem>
        </Card>
      </Form>
    </>}
  />;
};

export default React.forwardRef(Dispatch);
