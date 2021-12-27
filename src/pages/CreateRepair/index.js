import React from 'react';
import { useRequest } from '../../util/Request';
import { Button, Card, Form, NoticeBar, Toast } from 'antd-mobile';
import MyPicker from '../components/MyPicker';
import { commonArea, CustomerNameListSelect } from '../Repair/RepairUrl';
import MyTreeSelect from '../components/MyTreeSelect';
import { DatePicker, Input, NumberInput, TextArea } from 'weui-react-v2';
import UploadImg from './UploadImg';
import { history } from 'umi';
import { Affix } from 'antd';

const { Item: FromItem } = Form;

const CreateRepair = () => {

  const { data, run } = useRequest({
    url: '/api/getDeliveryList',
    method: 'POST',
  }, {
    manual: true,
  });


  const { run: runSaveRepair } = useRequest({
    url: '/api/saveRepair',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: () => {
      Toast.show({
        content:'报修成功！',
        position: 'bottom',
      });
      history.goBack();
    },
  });


  return <div>
    <Affix offsetTop={0}>
      <NoticeBar content='欢迎使用道昕智造一键报修系统' color='alert' />
    </Affix>
    <Form
      onFinish={(value) => {
        runSaveRepair({
          data:{
            ...value,
          }
        });
      }}
      onValuesChange={(value)=>{
        if (value.customerId){
          run(
            {
              data: {customerId: value.customerId || '111'}
            }
          );
        }
      }}
      footer={
        <Button type='submit' style={{ width: '100%' }}>一键报修</Button>
      }
    >
      <Card title='使用单位'>
        <FromItem label='公司名称' name='customerId' rules={[{ required: true, message: '该字段是必填字段！' }]}>
          <MyPicker api={CustomerNameListSelect} />
        </FromItem>
        <FromItem label='省市区' name='area' rules={[{ required: true, message: '该字段是必填字段！' }]}>
          <MyTreeSelect api={commonArea} />
        </FromItem>

        <FromItem label='详细地址' name='address' rules={[{ required: true, message: '该字段是必填字段！' }]}>
          <Input placeholder='输入详细地址' />
        </FromItem>

        <FromItem label='姓名' name='people' rules={[{ required: true, message: '该字段是必填字段！' }]}>
          <Input placeholder='输入姓名' />
        </FromItem>

        <FromItem label='电话' name='telephone' rules={[{ required: true, message: '该字段是必填字段！' }]}>
          <Input placeholder='输入电话' />
        </FromItem>

        <FromItem label='职务' name='position' rules={[{ required: true, message: '该字段是必填字段！' }]}>
          <Input placeholder='输入职务' />
        </FromItem>
      </Card>
      <Card title='报修信息'>

        <FromItem label='设备名称' name='itemId' rules={[{ required: true, message: '该字段是必填字段！' }]}>
          <MyPicker option={data ? data.map((items)=>{
            return {
              label: items.itemsResult.name,
              value: items.deliveryDetailsId
            }
          }) : []} />
        </FromItem>

        <FromItem label='图片' name='itemImgUrlList' rules={[{ required: true, message: '该字段是必填字段！' }]}>
          <UploadImg />
        </FromItem>

        <FromItem label='服务类型' name='serviceType' rules={[{ required: true, message: '该字段是必填字段！' }]}>
          <MyPicker option={[{ label: '设备项修', value: '设备项修' }]} />
        </FromItem>

        <FromItem label='期望到达日期' name='expectTime' rules={[{ required: true, message: '该字段是必填字段！' }]}>
          <DatePicker />
        </FromItem>

        <FromItem label='维修费用' name='money' rules={[{ required: true, message: '该字段是必填字段！' }]}>
          <NumberInput placeholder='维修费用' type='number' />
        </FromItem>

        <FromItem label='描述' name='comment' rules={[{ required: true, message: '该字段是必填字段！' }]}>
          <TextArea placeholder='描述内容' />
        </FromItem>
      </Card>
    </Form>
  </div>;
};
export default CreateRepair;
