import React, { useEffect, useRef, useState } from 'react';
import {
  DatePicker,
  ListItem, NumberInput,
  Switch,
  TextArea, WhiteSpace,
} from 'weui-react-v2';
import { history } from 'umi';
import { Button, Card, Dialog, Form } from 'antd-mobile';
import MyPicker from '../../../components/MyPicker';
import UpLoadImg from '../../../components/Upload';
import { BusinessNameListSelect, contractIdSelect, customerIdSelect, trackMessageAdd } from '../CustomerUrl';
import { useRequest } from '../../../../util/Request';
import wx from 'populee-weixin-js-sdk';

const { Item: FormItem } = Form;

const Track = (props) => {

  const [location,setLocation] = useState();


  useEffect(()=>{
    wx.ready(function() {
      wx.getLocation({
        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function(res) {
          const latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
          const longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
          setLocation({ latitude, longitude });
        },
      });
    });
  },[]);



  const params = props.location.query;

  const [hidden, setHidden] = useState(false);
  const [txHidden, setTxHidden] = useState(false);
  const [classNmb, setClassNmb] = useState(parseInt(params.classify) || 0);

  const { run } = useRequest(trackMessageAdd, {
    manual: true,
  });


  const formRef = useRef();

  useEffect(() => {
    formRef.current.setFieldsValue({ classify: params.classify || 0, customerId: params.customerId });
  }, [params.classify, params.customerId]);


  const label = [
    '日常', '商机', '合同', '订单', '回款',
  ];

  const apis = [
    false,
    BusinessNameListSelect,
    contractIdSelect,
    false,
    false,
  ];

  const returnFormItem = (index) => {
    return (<FormItem
      label={label[classNmb]}
      name='classifyId'
      rules={[{ required: true, message: '该字段是必填字段！' }]}
    >
      {apis[classNmb] ? <MyPicker api={apis[classNmb]} /> : <MyPicker option={[]} />}
    </FormItem>);
  };

  return (
    <>
      <Form
        ref={formRef}
        onValuesChange={(values) => {
          if (values.classify) {
            setClassNmb(values.classify);
          }
        }}
        onFinish={async (values) => {
          await run({
            data: {
              ...values,
              businessTrackParams: [{
                classifyId: values.classifyId,
                classify: values.classify,
                type: values.type,
                note: values.note,
                image: values.image,
                time: values.time,
                message: values.message,
                money: values.money,
                longitude:location && location.longitude,
                latitude:location && location.latitude,
              }],
            },
          });
          Dialog.alert({
            content: '添加成功',
            onConfirm: () => {
              history.goBack();
            },
          })
        }}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Button color='primary' type='submit' style={{ width: '45%', marginRight: '5%' }}>保存</Button>
            <Button color='default' style={{ width: '45%' }} onClick={() => {
              history.goBack();
            }}>返回</Button>
          </div>
        }
      >
        <Card
          title='客户信息'
        >
          <FormItem name='customerId' label='客户名称' rules={[{ required: true, message: '该字段是必填字段！' }]}>
            <MyPicker disabled api={customerIdSelect} />
          </FormItem>
        </Card>

        <Card
          title='事项'
        >

          <FormItem
            label='分类'
            name='classify'
            rules={[{ required: true, message: '该字段是必填字段！' }]}
          >
            <MyPicker option={[
              {
                label: '日常',
                value: '0',
              }, {
                label: '商机',
                value: '1',
              }, {
                label: '合同',
                value: '2',
              }, {
                label: '订单',
                value: '3',
              }, {
                label: '回款',
                value: '4',
              },
            ]} />
          </FormItem>
          {classNmb > 0 && returnFormItem(classNmb)}
          <FormItem
            label='跟踪类型'
            name='type'
            rules={[{ required: true, message: '该字段是必填字段！' }]}
          >
            <MyPicker option={[
              { label: '上门培训', value: '上门培训' },
              { label: '视频辅导', value: '视频辅导' },
              { label: '上门维修', value: '上门维修' },
              { label: '客户投诉', value: '客户投诉' },
              { label: '客户反馈', value: '客户反馈' },
              { label: '产品发货', value: '产品发货' },
              { label: '产品安装', value: '产品安装' },
              { label: '定期检修', value: '定期检修' },
            ]} />
          </FormItem>
          <FormItem
            label='跟踪内容'
            rules={[{ required: true, message: '该字段是必填字段！' }]}
            name='note'>
            <TextArea placeholder='跟踪内容' />
          </FormItem>
          <FormItem
            label='图片'
            name='image'>
            <UpLoadImg />
          </FormItem>
          <Switch
            style={{ margin: 8 }}
            checkedNode='关闭提醒'
            unCheckedNode='开启提醒'
            size='small'
            checked={txHidden}
            onChange={() => {
              setTxHidden(!txHidden);
            }}
          />
          <WhiteSpace />
          {txHidden ? <FormItem
            rules={[{ required: true, message: '该字段是必填字段！' }]}
            label='跟进提醒时间'
            name='time'>
            <DatePicker placeholder='请选择' mode='datetime' defaultValue={null}>
              <ListItem style={{ padding: 0 }} arrow={true} />
            </DatePicker>
          </FormItem> : null}
          {txHidden ? <FormItem
            rules={[{ required: true, message: '该字段是必填字段！' }]}
            label='提醒内容'
            name='message'>
            <TextArea placeholder='提醒内容' />
          </FormItem> : null}

          <Switch
            style={{ margin: 8 }}
            checkedNode='暂不报价'
            unCheckedNode='马上报价'
            size='small'
            checked={hidden}
            onChange={() => {
              setHidden(!hidden);
            }}
          />

          {hidden ? <FormItem
            label='报价金额'
            rules={[{ required: true, message: '该字段是必填字段！' }]}
            name='money'>
            <NumberInput placeholder='报价金额' type='number' />
          </FormItem> : null}


        </Card>
      </Form>
    </>
  );
};
export default Track;
