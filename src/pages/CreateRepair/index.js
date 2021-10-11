import {
  Brief,
  Button,
  DatePicker,
  Form,
  FormItem,
  Input,
  List, ListItem, Panel,
  PanelItem,
  Picker,
  SingleUpload,
  TextArea,
} from 'weui-react-v2';
import { NoticeBar } from 'antd-mobile';
import {
  PlusCircleOutlined, LoadingOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import React, { useState } from 'react';

import { district } from 'antd-mobile-demo-data';

const CreateRepair = () => {
  const [state, setState] = useState(true);
  const [setValue] = useState({
    data: [],
    cols: 1,
    pickerValue: [],
    asyncValue: [],
    visible: false,
    colorValue: ['#00FF00'],
  });

  // const getSel = () => {
  //   const value1 = value.pickerValue;
  //   if (!value1) {
  //     return '';
  //   }
  //   const treeChildren = arrayTreeFilter(district, (c, level) => c.value === value1[level]);
  //   return treeChildren.map(v => v.label).join(',');
  // }
  return(
    <>
      <NoticeBar marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }} content=''>
        欢迎使用道昕智造一键报修系统
      </NoticeBar>
      <Form labelWidth="30vw"
            defaultModel={{
              // company: 0,
              // sbName:"b设备",
              // brand: "波司登",
              // pct:"辽宁省鞍山市",
              // address:"c地址",
              // number: "111111",
              // name: "d",
              // position:"经理",
              // phone:"18899994444",
              // type: "设备报修",
              // imgs:"",
              // date: "2021-09-09 10:30:00",
              // time: "2021-09-09 10:30:00",
              // feedback: "11111111111111111111111111111111",
            }}
      >
        <List title="终端客户">
          <FormItem  prop="company"  label="公司名称" >
            <Picker title="请选择" placeholder="请选择公司名称"  data={[
              {
                label: 'A公司',
                value: 0,
              }, {
                label: 'B公司',
                value: 1,
              },
            ]}/>
          </FormItem >
          <FormItem  prop="pct"  label='省市区' >
            <Picker
              // visible={value.visible}
              data={district}

              onChange={v => setValue({ pickerValue: v })}
              onOk={() => setValue({ visible: false })}

            >
              <ListItem onClick={() => {setValue({ visible: true })}}/>
            </Picker>
          </FormItem>
          <FormItem  prop="address"  label='详细地址' >
            <Input placeholder="请输入详细地址" maxlength={10} />
          </FormItem>
          <FormItem  prop="name"  label='姓名'  >
            <Input placeholder="请输入姓名" maxlength={10}  />
          </FormItem>
          <FormItem prop="phone"  label='联系电话'  >
            <Input placeholder="请输入联系电话"  type="phone" pattern="[0-9]*" maxlength={13}  />
          </FormItem>
        </List>
        <List title="产品信息">
          <FormItem  prop="sbName"  label="设备名称" >
            <Picker title="请选择" placeholder="请选择"  data={[
              {
                label: 'AMG',
                value: 0,
              }, {
                label: 'PG',
                value: 1,
              }, {
                label: 'AG',
                value: 2,
              }, {
                label: 'SW',
                value: 3,
              }, {
                label: 'G63',
                value: 4,
              }, {
                label: 'D57',
                value: 5,
              }
            ]} />
          </FormItem >
        </List>
        <List title="设备报修内容">
          <FormItem prop="type" label="服务类型" arrow={true}>
            <Picker title="请选择" placeholder="请选择"  data={[
              {
                label: '设备维修',
                value: 0,
              }, {
                label: '配件更换',
                value: 1,
              }, {
                label: '设备调试',
                value: 2,
              }, {
                label: '设备大修',
                value: 3,
              }, {
                label: '设备保养',
                value: 4,
              }, {
                label: '设备改造',
                value: 5,
              }
            ]}/>
          </FormItem>
          <FormItem   prop="ms"  label='快捷报修描述'  >
            <Picker title="请选择" placeholder="请选择"  data={[
              {
                label: '我不清楚故障原因，请尽快与我联系',
                value: 0,
              }, {
                label: '主轴异响',
                value: 1,
              }, {
                label: '控制系统问题',
                value: 2,
              }, {
                label: '电气问题',
                value: 3,
              }
            ]}/>
          </FormItem>
          <FormItem prop="feedback" label='报修详情描述' alignItems="flex-start">
            <TextArea placeholder="请输入报修内容关键词，系统会自动匹配出相关问题内容，以便您选择" />
          </FormItem>
          <FormItem prop="imgs" label="报修照片">
            <SingleUpload style={{ marginLeft: '10px' }} action="/upload"  />
          </FormItem>
          <FormItem prop="date" label="期望到达时间">
            <DatePicker placeholder="请输入预计到达时间"  />
          </FormItem>
        </List>
        <Button type="primary" style={{width: '50%'}} onClick={()=>{setState(true);}}>工单负责任</Button>
        <Button style={{width: '50%'}} onClick={()=>{setState(false);}}>自动派单</Button>
        {state ? <div >
          <List title="负责人">
            <PlusCircleOutlined style={{margin: 20 ,fontSize: '10vw'}}/>
          </List>
          <List title="协同人">
            <PlusCircleOutlined style={{margin: 20 ,fontSize: '10vw'}}/>
          </List>
        </div> :
          <div>
            <List title="根据默认规则将分配给">
              <Panel >
                <PanelItem
                  title={<div><div style={{display: 'inline', fontSize: 10}}>狄仁杰</div><div style={{display: 'inline', marginLeft: 5}}>1890.58KM</div></div>}
                  thumb={ <TeamOutlined style={{margin: 20 ,fontSize: '10vw'}}/>}
                  // text={true}
                  info={
                    <>
                      <div style={{marginTop: 10}}>
                        <Brief >营销部/销售服务部/天津区域</Brief>
                        <Brief style={{marginLeft: 20 ,color: 'green'}}>工作中 <LoadingOutlined /></Brief>
                      </div>
                    </>
                  }
                >
                </PanelItem>
              </Panel>

            </List>
            <List title="协同人">
              <PlusCircleOutlined style={{margin: 20 ,fontSize: '10vw'}}/>
            </List>
          </div>
        }
        <div style={{backgroundColor: 'white'}}>
          <Button style={{marginLeft: '35%',width: '30%', height: 40}}>仅提交报修</Button>
          <Button type="primary"  style={{marginLeft: 5, width: '30%', height: 40}}>保存并派单</Button>
        </div>

      </Form>


    </>
  );
};
export default CreateRepair;
