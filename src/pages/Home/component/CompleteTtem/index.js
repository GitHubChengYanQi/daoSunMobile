import {
  Button,
  DatePicker,
  Form,
  FormItem,
  Input,
  List,
  ListItem,
  NumberInput, Picker,
  Preview,
  PreviewButton,
  PreviewItem,
  SingleUpload, TextArea,
} from 'weui-react-v2';
import { DownOutlined, RightOutlined, UpOutlined } from '@ant-design/icons';
import React from 'react';
import { router } from 'umi';
import { Select } from 'antd';
import { Option } from 'antd/es/mentions';

const CompleteTtem = () =>{
  return(
    <>
      {/*<Form*/}
      {/*  labelWidth="20vw"*/}
      {/*  // validConfig={validConfig}*/}
      {/*  // defaultModel={{*/}
      {/*  //   img: 'http://365wifi.oss-cn-zhangjiakou.aliyuncs.com/cabinet/20210104/97013ff8d05e4c4ab39bc0aa0f7f86bf.jpg',*/}
      {/*  //   imgs: [*/}
      {/*  //     'http://365wifi.oss-cn-zhangjiakou.aliyuncs.com/cabinet/20210104/97013ff8d05e4c4ab39bc0aa0f7f86bf.jpg',*/}
      {/*  //   ],*/}
      {/*  //   amount: 33.45,*/}
      {/*  // }}*/}
      {/*  // getFormMethods={(methods) => (formMethods.current = methods)}*/}
      {/*  // onSubmit={subamit}*/}
      {/*>*/}
          {/*<List title={<div style={{marginLeft: 10, fontSize: 26}}>完成事项</div>} >*/}
          {/*    <FormItem prop="name" label="客户名称">*/}
          {/*      <Input placeholder="请输入真实姓名" maxlength={10} value="张家口完全机械厂"/>*/}
          {/*    </FormItem>*/}
          {/*  <FormItem prop="name" label="关联联系人">*/}
          {/*    <Input placeholder="请输入真实姓名" maxlength={10} />*/}
          {/*  </FormItem>*/}
          {/*  <FormItem prop="name" label="计划时间">*/}
          {/*    <Input placeholder="请输入真实姓名" maxlength={10} />*/}
          {/*  </FormItem>*/}
          {/*  <FormItem prop="name" label="事项主题">*/}
          {/*    <Input placeholder="请输入真实姓名" maxlength={10} />*/}
          {/*  </FormItem>*/}
          {/*  <FormItem prop="name" label="事项内容">*/}
          {/*    <Input placeholder="请输入真实姓名" maxlength={10} />*/}
          {/*  </FormItem>*/}

          {/*</List>*/}

          {/*  <FormItem prop="vcode" label="验证码" extra={<Button size="small">获取验证码</Button>}>*/}
          {/*    <Input placeholder="请输入验证码" pattern="[0-9]*" maxlength={6} />*/}
          {/*  </FormItem>*/}
          {/*  <FormItem prop="name" label="姓名">*/}
          {/*    <Input placeholder="请输入真实姓名" maxlength={10} />*/}
          {/*  </FormItem>*/}
          {/*  <FormItem prop="age" label="年龄" defaultValue={22}>*/}
          {/*    <NumberInput*/}
          {/*      style={{ width: '50%' }}*/}
          {/*      min={1}*/}
          {/*      max={120}*/}
          {/*      maxlength={3}*/}
          {/*      pattern="[0-9]*"*/}
          {/*      showControl={true}*/}
          {/*    />*/}
          {/*  </FormItem>*/}
          {/*  <FormItem prop="amount" label="金额">*/}
          {/*    <NumberInput type="amount" placeholder="请输入金额" precision={4} />*/}
          {/*  </FormItem>*/}
          {/*  <FormItem prop="date" label="日期">*/}
          {/*    <DatePicker placeholder="请选择生日" useDefaultFormat={false} separator="" />*/}
          {/*  </FormItem>*/}
          {/*  <FormItem prop="feedback" label="问题反馈" alignItems="flex-start">*/}
          {/*    <TextArea placeholder="请输入您遇到的问题" />*/}
          {/*  </FormItem>*/}
          {/*</List>*/}
          {/*<List title="原生选择框">*/}
          {/*  <FormItem prop="loginType" defaultValue="2" arrow="horizontal">*/}
          {/*    <select>*/}
          {/*      <option value="">不选</option>*/}
          {/*      <option value="1">微信号</option>*/}
          {/*      <option value="2">QQ号</option>*/}
          {/*      <option value="3">Email</option>*/}
          {/*    </select>*/}
          {/*  </FormItem>*/}
          {/*  <FormItem*/}
          {/*    className="virtual-select"*/}
          {/*    label={*/}
          {/*      <FormItem prop="zoneCode" labelString="区号" simple={true} defaultValue="86">*/}
          {/*        <select>*/}
          {/*          <option value="86">+86</option>*/}
          {/*          <option value="80">+80</option>*/}
          {/*          <option value="87">+87</option>*/}
          {/*        </select>*/}
          {/*      </FormItem>*/}
          {/*    }*/}
          {/*  >*/}
          {/*    <FormItem prop="zonePhone" labelString="区域手机号" simple={true}>*/}
          {/*      <Input placeholder="请输入手机号" type="phone" pattern="[0-9]*" maxlength={13} />*/}
          {/*    </FormItem>*/}
          {/*  </FormItem>*/}
          {/*  <FormItem prop="country" label="国家" arrow="horizontal" defaultValue="2">*/}
          {/*    <select>*/}
          {/*      <option value="1">中国</option>*/}
          {/*      <option value="2">美国</option>*/}
          {/*      <option value="3">英国</option>*/}
          {/*    </select>*/}
          {/*  </FormItem>*/}
          {/*</List>*/}
          {/*<List title="Picker选择器">*/}
          {/*  <FormItem prop="piao" label="票据" arrow={true}>*/}
          {/*    /!*<Picker title="请选择" placeholder="请选择" data={singlePickerData} />*!/*/}
          {/*  </FormItem>*/}
          {/*</List>*/}
          {/*<List title="文件">*/}
          {/*  <FormItem prop="img" label="头像">*/}
          {/*    /!*<SingleUpload<Res> action="/upload" getResponse={getResponse} />*!/*/}
          {/*  </FormItem>*/}
          {/*  <FormItem prop="imgs" label="照片墙">*/}
          {/*    /!*<MultiUpload<Res> length={3} action="/upload" getResponse={getResponse} />*!/*/}
          {/*  </FormItem>*/}


        {/*<div className="form-tips">*/}
        {/*  <Checkbox size="small">*/}
        {/*    阅读并同意<a>《相关条款》</a>*/}
        {/*  </Checkbox>*/}
        {/*</div>*/}
        {/*<div className="form-btns">*/}
        {/*  <SubmitButton size="large">确定</SubmitButton>*/}
        {/*</div>*/}
      {/*</Form>*/}
      <Preview subTitle={<div style={{marginLeft: 10, fontSize: 26}}>完成事项</div>} title={<div style={{marginRight: 10, fontSize: 20, color: 'blue'}}>确定</div>} >
        <PreviewItem title="客户名称:">张家口完全机械厂</PreviewItem>
        <PreviewItem title="关联联系人:">张三</PreviewItem>
        <PreviewItem title="计划时间:">2020-09-09 10:00</PreviewItem>
        <PreviewItem title="事项主题:">需求跟进</PreviewItem>
        <PreviewItem title="事项内容:">了解张总的真实需求</PreviewItem>
      </Preview>
      <Preview subTitle={<div style={{marginLeft: 10, fontSize: 26}}>完成内容</div>} >
        <PreviewItem title="完成时间:">2020-09-09 10:00</PreviewItem>
        <PreviewItem title="完成记录:">张三三三三三三三三三三三三三三三三三三三三三三三三三三三三三三三三</PreviewItem>
        <PreviewItem title="计划时间:">2020-09-09 10:00</PreviewItem>
        <PreviewItem title="事项主题:">需求跟进</PreviewItem>
        <PreviewItem title="事项内容:">了解张总的真实需求</PreviewItem>
      </Preview>
      <Preview subTitle={<div style={{marginLeft: 10, fontSize: 26}}>预约下次计划</div>} >
        <PreviewItem title="计划时间:">2020-09-09 10:00</PreviewItem>
        <PreviewItem title="安排给:"><div style={{fontSize: 20}} onClick={()=>{router.push('/CompleteTrack');}}>自己 {<RightOutlined />}</div></PreviewItem>
        <PreviewItem title="事件主题:">2020-09-09 10:00</PreviewItem>
        <PreviewItem title="事项主题:">   <Select defaultValue="1" style={{width: '30%', backgroundColor: '#E6E6E6'}}>
          <Option value="1">日常维护</Option>
          <Option value="2">配件更换</Option>
          <Option value="3">设备更换</Option>
        </Select></PreviewItem>
        <PreviewItem title="事项内容:">了解张总的真实需求</PreviewItem>
      </Preview>
      <Button type="primary" style={{width: '100%'}}>
        保存
      </Button>
    </>
  );
  }
;
export default CompleteTtem;
