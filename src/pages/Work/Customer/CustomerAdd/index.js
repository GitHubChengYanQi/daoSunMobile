import React, { useState } from 'react';
import {
  DatePicker, DialogPop,
  Form,
  FormItem,
  Input,
  List,
  ListItem,
  Picker,
  SubmitButton,
  Switch,
  TextArea,
} from 'weui-react-v2';
import { router } from 'umi';

const CustomerAdd = () => {

  const [detail,setDetail] = useState();

  return (
    <>
      <Form
        labelWidth='22vw'
        onSubmit={(value)=>{
          DialogPop({
            title: '提示：如有异议请联系创建人或领导协调',
            children: '您输入的客户已经被创建 创建人：张三',
            onConfirm: () => {
              return new Promise((resolve) => {
                setTimeout(() => {
                  router.goBack();
                  resolve(true);
                }, 2000);
              });
            },
          });
        }}
      >
        <List title='基础数据'>
          <FormItem prop='customerName' label='客户名称'>
            <Input placeholder='请输入客户名称' autoFocus={true} />
          </FormItem>
          <FormItem prop='customerName' label='客户状态'>
            <Picker title='请选择' placeholder='请选择' data={[
              {
                label: '潜在客户',
                value: 0,
              }, {
                label: '正式客户',
                value: 1,
              },
            ]}>
              <ListItem arrow={true} style={{padding:0}} />
            </Picker>
          </FormItem>
          <FormItem prop='customerName' label='客户分类'>
            <Picker title='请选择' placeholder='请选择' data={[
              {
                label: '代理商',
                value: 0,
              }, {
                label: '终端用户',
                value: 1,
              },
            ]}>
              <ListItem arrow={true} style={{padding:0}} />
            </Picker>
          </FormItem>
          <FormItem prop='customerName' label='负责人'>
            <Picker title='请选择' placeholder='请选择' data={[
              {
                label: '100',
                value: 0,
              }, {
                label: '101',
                value: 1,
              },
            ]}>
              <ListItem arrow={true} style={{padding:0}} />
            </Picker>
          </FormItem>
          <FormItem prop='customerName' label='客户级别'>
            <Picker title='请选择' placeholder='请选择' data={[
              {
                label: '低',
                value: 0,
              }, {
                label: '中',
                value: 1,
              },{
                label: '高',
                value: 2,
              },
            ]}>
              <ListItem arrow={true} style={{padding:0}} />
            </Picker>
          </FormItem>
        </List>
        <List title={<Switch checkedNode='收齐详细数据' unCheckedNode='展开详细数据' onChange={(value)=>{
          setDetail(value);
        }} />}>
          <div style={{display:!detail && 'none'}}>
            <FormItem prop='customerName' label='法定代表人'>
              <Input placeholder='请输入法定代表人' autoFocus={true} />
            </FormItem>
            <FormItem prop='customerName' label='公司类型'>
              <Picker title='请选择' placeholder='请选择' data={[{value: '有限责任公司（自然人独资）', label: '有限责任公司（自然人独资）'}, {value: '股份有限公司', label: '股份有限公司'}, {
                value: '有限合伙企业',
                label: '有限合伙企业'
              }, {value: '外商独资企业', label: '外商独资企业'}, {value: '个人独资企业', label: '个人独资企业'}, {
                value: '国有独资公司',
                label: '国有独资公司'
              }, {value: '其他类型', label: '其他类型'}]}>
                <ListItem arrow={true} style={{padding:0}} />
              </Picker>
            </FormItem>
            <FormItem prop='customerName' label='成立时间'>
              <DatePicker placeholder="请选择" defaultValue={null} useDefaultFormat={false} separator="">
                <ListItem style={{padding:0}} arrow={true} />
              </DatePicker>
            </FormItem>
            <FormItem prop='customerName' label='社会信用代码'>
              <Input placeholder='请输入社会信用代码' autoFocus={true} />
            </FormItem>
            <FormItem prop='customerName' label='营业期限'>
              <DatePicker placeholder="请选择" defaultValue={null} useDefaultFormat={false} separator="">
                <ListItem style={{padding:0}} arrow={true} />
              </DatePicker>
            </FormItem>
            <FormItem prop='customerName' label='注册地址'>
              <Input placeholder='请输入注册地址' autoFocus={true} />
            </FormItem>
            <FormItem prop='customerName' label='客户来源'>
              <Picker title='请选择' placeholder='请选择' data={[
                {
                  label: '100',
                  value: 0,
                }, {
                  label: '101',
                  value: 1,
                },
              ]}>
                <ListItem arrow={true} style={{padding:0}} />
              </Picker>
            </FormItem>
            <FormItem prop='customerName' label='邮箱'>
              <Input placeholder='请输入邮箱' autoFocus={true} />
            </FormItem>
            <FormItem prop='customerName' label='网址'>
              <Input placeholder='请输入网址' autoFocus={true} />
            </FormItem>
            <FormItem prop='customerName' label='行业'>
              <Picker title='请选择' placeholder='请选择' data={[
                {
                  label: '100',
                  value: 0,
                }, {
                  label: '101',
                  value: 1,
                },
              ]}>
                <ListItem arrow={true} style={{padding:0}} />
              </Picker>
            </FormItem>
            <FormItem prop='customerName' label='简介'>
              <TextArea placeholder="简介" />
            </FormItem>
            <FormItem prop='customerName' label='备注'>
              <TextArea placeholder="备注" />
            </FormItem>
          </div>
        </List>
        <List title='联系人信息'>
          <FormItem prop='contacts' label='联系人姓名'>
            <Input placeholder='请输入联系人姓名' autoFocus={true} />
          </FormItem>
          <FormItem prop='customerName' label='职务'>
            <Picker title='请选择' placeholder='请选择' data={[
              {
                label: 'CEO',
                value: 0,
              }, {
                label: 'NOC',
                value: 1,
              },
            ]}>
              <ListItem arrow={true} style={{padding:0}} />
            </Picker>
          </FormItem>
          <FormItem prop='customerName' label='联系电话'>
            <Input placeholder='请输入联系电话' type='phone' autoFocus={true} />
          </FormItem>
        </List>
        <List title='地址信息'>
          <FormItem prop='customerName' label='所属区域'>
            <Picker title='请选择' placeholder='请选择' data={[
              {
                label: '辽宁省',
                value: 0,
              }, {
                label: '北京市',
                value: 1,
              },
            ]}>
              <ListItem arrow={true} style={{padding:0}} />
            </Picker>
          </FormItem>
          <FormItem prop='customerName' label='详细地址'>
            <Input placeholder='请输入详细地址' autoFocus={true} />
          </FormItem>
        </List>
        <div style={{textAlign:'center',margin:8}}>
          <SubmitButton style={{width:'50%'}}>保存并完善更多信息</SubmitButton>
          <SubmitButton style={{width:'50%'}}>保存</SubmitButton>
        </div>
      </Form>
    </>
  );
};

export default CustomerAdd;
