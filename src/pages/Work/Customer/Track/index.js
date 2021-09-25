import React, { useState } from 'react';
import {
  Button,
  DatePicker,
  Form,
  FormItem,
  Input,
  List,
  ListItem, NumberInput,
  Picker,
  SingleUpload, SubmitButton,
  Switch,
  TextArea, Toptips,
} from 'weui-react-v2';
import { router } from 'umi';

const Track = () => {

  const params =  window.location.href.split('?')[1];

  const [hidden, setHidden] = useState(false);
  const [txHidden, setTxHidden] = useState(false);
  const [classNmb, setClassNmb] = useState(params);

  const returnFormItem = (classNmb, index) => {
    console.log(classNmb);
    let businessId = null;
    let contractId = null;
    let orderId = null;
    let backMoney = null;
    if (classNmb === '1') {
      // businessId = val.businessId;
      return (<FormItem
        label="商机"
        prop='customer'>
        <Picker title='请选择' placeholder='请选择' data={[
          {
            label: '100',
            value: 0,
          }, {
            label: '101',
            value: 1,
          },{
            label: '102',
            value: 2,
          },{
            label: '103',
            value: 3,
          },{
            label: '104',
            value: 4,
          },
        ]}>
          <ListItem arrow={true} style={{padding:0}} />
        </Picker>
      </FormItem>);
    }
    if (classNmb === '2') {
      // contractId = val.contractId;
      return (<FormItem
        label="合同"
        prop='customer'>
        <Picker title='请选择' placeholder='请选择' data={[
          {
            label: '100',
            value: 0,
          }, {
            label: '101',
            value: 1,
          },{
            label: '102',
            value: 2,
          },{
            label: '103',
            value: 3,
          },{
            label: '104',
            value: 4,
          },
        ]}>
          <ListItem arrow={true} style={{padding:0}} />
        </Picker>
      </FormItem>);
    }
    if (classNmb === '3') {
      // orderId = val.orderId;
      return (<FormItem
        label="订单"
        prop='customer' >
        <Picker title='请选择' placeholder='请选择' data={[
          {
            label: '100',
            value: 0,
          }, {
            label: '101',
            value: 1,
          },{
            label: '102',
            value: 2,
          },{
            label: '103',
            value: 3,
          },{
            label: '104',
            value: 4,
          },
        ]}>
          <ListItem arrow={true} style={{padding:0}} />
        </Picker>
      </FormItem>);
    }
    if (classNmb === '4') {
      // backMoney = val.backMoney;
      return (<FormItem
        label="回款"
        prop='customer'>
        <Picker title='请选择' placeholder='请选择' data={[
          {
            label: '100',
            value: 0,
          }, {
            label: '101',
            value: 1,
          },{
            label: '102',
            value: 2,
          },{
            label: '103',
            value: 3,
          },{
            label: '104',
            value: 4,
          },
        ]}>
          <ListItem arrow={true} style={{padding:0}} />
        </Picker>
      </FormItem>);
    }
  };

  return (
    <>
      <Form
        labelWidth='22vw'
        onSubmit={() => {
          Toptips('提交成功', 'success');
          setTimeout(()=>{
            router.goBack();
          },1000);
        }}
      >
        <List
          title='客户信息'
        >
          <FormItem prop='customer' label='客户名称'>
            <Input placeholder='道昕智造' disabled autoFocus={true} />
          </FormItem>
        </List>

        <List
          title='事项'
        >
          <FormItem
            label='分类'
            prop='contacts'
          >
            <Picker title='请选择' onChange={(value)=>{
              setClassNmb(value[0])
            }} placeholder='请选择' data={[
              {
                label: '日常',
                value: '0',
              }, {
                label: '商机',
                value: '1',
              },{
                label: '合同',
                value: '2',
              },{
                label: '订单',
                value: '3'
              },{
                label: '回款',
                value: '4',
              },
            ]}>
              <ListItem arrow={true} style={{padding:0}} />
            </Picker>
          </FormItem>
          {returnFormItem(classNmb)}
          <FormItem
            label='跟踪类型'
            >
            <Picker title='请选择' placeholder='请选择' data={[
              {label: '上门培训', value: '上门培训'},
              {label: '视频辅导', value: '视频辅导'},
              {label: '上门维修', value: '上门维修'},
              {label: '客户投诉', value: '客户投诉'},
              {label: '客户反馈', value: '客户反馈'},
              {label: '产品发货', value: '产品发货'},
              {label: '产品安装', value: '产品安装'},
              {label: '定期检修', value: '定期检修'}
            ]}>
              <ListItem arrow={true} style={{padding:0}} />
            </Picker>
          </FormItem>
          <FormItem
            label='跟踪内容'
            prop='customer'>
              <TextArea defaultValue='跟踪内容' />
          </FormItem>
          <FormItem
            label='图片'
            prop='customer'>
            <SingleUpload style={{ marginLeft: '30px',backgroundColor:'#fff' }} action="" />
          </FormItem>
          <Switch
            style={{ marginLeft: '18%', marginBottom: 20, width: 100 }}
            checkedNode='关闭提醒'
            unCheckedNode='开启提醒'
            checked={txHidden}
            onChange={() => {
              setTxHidden(!txHidden);
            }}
          > </Switch>
          {txHidden ? <FormItem
            label='跟进提醒时间'
            prop='customer'>
            <DatePicker placeholder="请选择" mode="datetime" defaultValue={null}>
              <ListItem style={{padding:0}} arrow={true} />
            </DatePicker>
          </FormItem> : null}
          {txHidden ? <FormItem
            label='提醒内容'
            prop='customer'>
              <TextArea defaultValue='提醒内容' />
          </FormItem> : null}
          <Switch
            style={{ marginLeft: '18%', marginBottom: 20, width: 100 }}
            checkedNode='暂不报价'
            unCheckedNode='马上报价'
            checked={hidden}
            onChange={() => {
              setHidden(!hidden);
            }}
          > </Switch>
          {hidden ? <FormItem
            label='报价金额'
            prop='customer'>
            <NumberInput placeholder="弹出金额键盘" type='number' />
          </FormItem> : null}
        </List>
        <div style={{textAlign:'center',margin:8}}>
          <SubmitButton style={{margin:8}}>保存</SubmitButton>
          <Button type='default' style={{margin:8}} onClick={()=>{
            router.goBack();
          }} >返回</Button>
        </div>
      </Form>
    </>
  );
};
export default Track;
