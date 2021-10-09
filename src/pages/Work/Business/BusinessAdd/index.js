import React, { useEffect, useRef, useState } from 'react';
import {
  DatePicker,
  DialogPop,
  Input,
  List,
  ListItem, NumberInput,
  Picker, PickerPanel,
  SubmitButton,
} from 'weui-react-v2';
import { router } from 'umi';
import { Card } from 'antd';
import './index.css';
import { Button, Dialog, Form, Stepper, Steps } from 'antd-mobile';
import { useRequest } from '../../../../util/Request';
import { crmBusinessAdd, crmBusinessSalesList, CustomerNameListSelect, OrgNameListSelect } from '../BusinessUrl';
import StepDetail from '../StepDetail';
import MyPicker from '../../../components/MyPicker';
import { UserIdSelect } from '../../Customer/CustomerUrl';

const { Item: FormItem } = Form;

const BusinessAdd = () => {

  const [visiable, setVisiable] = useState();

  const formRef = useRef();

  const { data: user } = useRequest({ url: '/rest/system/currentUserInfo', method: 'POST' });

  const { run } = useRequest(crmBusinessSalesList, { manual: true });
  const { run: businessAdd } = useRequest(crmBusinessAdd, { manual: true });

  const Sales = async () => {

    const sales = await run({});

    const data = await sales ? sales.map((items, index) => {
      return {
        text: items.name,
        key: items,
      };
    }) : [];

    Dialog.show({
      content: '人在天边月上明，风初紧，吹入画帘旌',
      closeOnAction: true,
      onAction: (action, index) => {
        setVisiable(action);
      },
      actions: data,
    });
  };

  useEffect(() => {
    Sales();
  }, []);


  return (
    <>
      {visiable &&
      <>
        <Card title='项目流程'>
          <StepDetail value={visiable && visiable.key} />
        </Card>
        <Form
          ref={formRef}
          footer={
            <div style={{ textAlign: 'center' }}>
              <Button color='primary' type='submit' style={{ margin: 8 }}>保存</Button>
              <Button style={{ margin: 8 }} onClick={() => {
                router.goBack();
              }}>返回</Button>
            </div>
          }
          onFinish={async (values) => {

            values = {
              ...values,
              salesId: visiable && visiable.key && visiable.key.salesId,
            };

            businessAdd({
              data: { ...values },
            }).then(() => {
              DialogPop({
                title: '提示：如有异议请联系创建人或领导协调',
                children: `您输入的客户已经被创建 创建人：${user && user.name}`,
                onConfirm: () => {
                  router.goBack();
                },
              });
            });
          }}
        >
          <List title='添加项目'>
            <FormItem name='businessName' label='项目名称' rules={[{ required: true, message: '该字段是必填字段！' }]}>
              <Input placeholder='请输入项目名称' />
            </FormItem>
            <FormItem name='customerId' label='客户名称' rules={[{ required: true, message: '该字段是必填字段！' }]}>
              <MyPicker api={CustomerNameListSelect} />
            </FormItem>
            <FormItem name='userId' label='负责人' rules={[{ required: true, message: '该字段是必填字段！' }]}>
              <MyPicker api={UserIdSelect} />
            </FormItem>
            <FormItem name='originId' label='机会来源' rules={[{ required: true, message: '该字段是必填字段！' }]}>
              <MyPicker api={OrgNameListSelect} />
            </FormItem>
            <FormItem name='opportunityAmount' label='项目金额' rules={[{ required: true, message: '该字段是必填字段！' }]}>
              <NumberInput placeholder='项目金额' />
            </FormItem>
            <FormItem name='time' label='立项日期' rules={[{ required: true, message: '该字段是必填字段！' }]}>
              <DatePicker placeholder='请选择' defaultValue={null} useDefaultFormat={false} separator=''>
                <ListItem style={{ padding: 0 }} arrow={true} />
              </DatePicker>
            </FormItem>

            <FormItem name='salesId' />
          </List>
        </Form>
      </>
      }
    </>
  );
};

export default BusinessAdd;
