import React, { useEffect, useRef, useState } from 'react';
import {
  DatePicker,
  Input,
  ListItem,
  Switch,
  TextArea,
} from 'weui-react-v2';
import { history } from 'umi';
import { Button, Card, Dialog, Form, Radio, Space } from 'antd-mobile';
import { useRequest } from '../../../../util/Request';
import {
  commonArea,
  CompanyRoleIdSelect,
  crmIndustryTreeView,
  CustomerLevelIdSelect,
  OriginIdSelect,
  UserIdSelect,
} from '../CustomerUrl';
import MyPicker from '../../../components/MyPicker';
import MyTreeSelect from '../../../components/MyTreeSelect';

const { Item: FormItem } = Form;

const CustomerAdd = () => {

  const [detail, setDetail] = useState();

  const formRef = useRef();

  const { data: user } = useRequest({ url: '/rest/system/currentUserInfo', method: 'POST' }, {
    onSuccess: (res) => {
      formRef.current.setFieldsValue({ userId: res && res.userId });
    },
  });

  useEffect(() => {
    formRef.current.setFieldsValue({ status: '0', classification: '0' });
  }, []);

  const { run } = useRequest(
    {
      url: '/customer/add', method: 'POST',
    }, {
      manual: true,
      onSuccess: (res) => {

      },
    },
  );


  return (
    <>
      <Form
        ref={formRef}
        onFinish={async (values) => {
          values = {
            ...values,
            contactsParams: [{
              contactsName: values.contactsName,
              companyRole: values.companyRole,
              phoneParams: [{ phoneNumber: values.phoneNumber }],
            }],
            adressParams: [{
              region: values.region,
              map: {address:values.address,map:values.location,city:values.city},
            }],
          };
          await run(
            {
              data: { ...values },
            },
          );
          Dialog.alert({
            content: `您输入的客户已经被创建 创建人：${user && user.name}`,
            onConfirm: () => {
              history.goBack();
            },
          })
        }}
        footer={
          <div style={{ textAlign: 'center', margin: 8 }}>
            <Button color='primary' type='submit' style={{ width: '20%', marginRight: '5%' }}>保存</Button>
            <Button color='default' style={{ width: '20%', marginRight: '5%' }} onClick={() => {
              history.goBack();
            }}>返回</Button>
            <Button color='primary' type='submit' style={{ width: '50%' }} fill='none'>保存并完善更多信息</Button>
          </div>
        }
      >
        <Card title='基础数据'>
          <FormItem label='客户名称' name='customerName' rules={[{ required: true, message: '该字段是必填字段！' }]}>
            <Input placeholder='请输入客户名称' />
          </FormItem>
          <FormItem name='status' label='客户状态'>
            <Radio.Group>
              <Space direction='horizontal'>
                <Radio value='0'>潜在客户</Radio>
                <Radio value='1'>正式客户</Radio>
              </Space>
            </Radio.Group>
          </FormItem>
          <FormItem name='classification' label='客户分类'>
            <Radio.Group
            >
              <Space direction='horizontal'>
                <Radio value='0'>代理商</Radio>
                <Radio value='1'>终端用户</Radio>
              </Space>
            </Radio.Group>
          </FormItem>
          <FormItem name='userId' label='负责人'>
            <MyPicker api={UserIdSelect} />
          </FormItem>
          <FormItem name='customerLevelId' label='客户级别'>
            <MyPicker api={CustomerLevelIdSelect} />
          </FormItem>
        </Card>
        <Card title={<Switch checkedNode='收起详细数据' unCheckedNode='展开详细数据' size={'small'} onChange={(value) => {
          setDetail(value);
        }} />}>
          <div style={{ display: !detail && 'none' }}>
            <FormItem name='legal' label='法定代表人'>
              <Input placeholder='请输入法定代表人' />
            </FormItem>
            <FormItem name='companyType' label='公司类型'>
              <MyPicker api={CustomerLevelIdSelect} option={
                [{ value: '有限责任公司（自然人独资）', label: '有限责任公司（自然人独资）' }, { value: '股份有限公司', label: '股份有限公司' }, {
                  value: '有限合伙企业',
                  label: '有限合伙企业',
                }, { value: '外商独资企业', label: '外商独资企业' }, { value: '个人独资企业', label: '个人独资企业' }, {
                  value: '国有独资公司',
                  label: '国有独资公司',
                }, { value: '其他类型', label: '其他类型' }]}
              />
            </FormItem>
            <FormItem name='setup' label='成立时间'>
              <DatePicker placeholder='请选择' defaultValue={null} useDefaultFormat={false} separator=''>
                <ListItem style={{ padding: 0 }} arrow={true} />
              </DatePicker>
            </FormItem>
            <FormItem name='utscc' label='社会信用代码'>
              <Input placeholder='请输入社会信用代码' />
            </FormItem>
            <FormItem name='businessTerm' label='营业期限'>
              <DatePicker placeholder='请选择' defaultValue={null} useDefaultFormat={false} separator=''>
                <ListItem style={{ padding: 0 }} arrow={true} />
              </DatePicker>
            </FormItem>
            <FormItem name='signIn' label='注册地址'>
              <Input placeholder='请输入注册地址' />
            </FormItem>
            <FormItem name='originId' label='客户来源'>
              <MyPicker api={OriginIdSelect} />
            </FormItem>
            <FormItem name='emall' label='邮箱'>
              <Input placeholder='请输入邮箱' />
            </FormItem>
            <FormItem name='url' label='网址'>
              <Input placeholder='请输入网址' />
            </FormItem>
            <FormItem name='industryId' label='行业'>
              <MyTreeSelect api={crmIndustryTreeView} />
            </FormItem>
            <FormItem name='introduction' label='简介'>
              <TextArea placeholder='简介' />
            </FormItem>
            <FormItem name='note' label='备注'>
              <TextArea placeholder='备注' />
            </FormItem>
          </div>
        </Card>

        <Card title='联系人信息'>
          <FormItem name='contactsName' label='联系人姓名' rules={[{ required: true, message: '该字段是必填字段！' }]}>
            <Input placeholder='请输入联系人姓名' />
          </FormItem>
          <FormItem name='companyRole' label='职务' rules={[{ required: true, message: '该字段是必填字段！' }]}>
            <MyPicker api={CompanyRoleIdSelect} />
          </FormItem>
          <FormItem name='phoneNumber' label='联系电话' rules={[{ required: true, message: '该字段是必填字段！' }]}>
            <Input placeholder='请输入联系电话' />
          </FormItem>
        </Card>
        <Card title='地址信息'>
          <FormItem name='region' label='所属区域'>
            <MyTreeSelect api={commonArea} />
          </FormItem>
          <FormItem name='address' label='详细地址'>
            <Input placeholder='请输入详细地址' />
          </FormItem>
        </Card>
      </Form>
    </>
  );
};

export default CustomerAdd;
