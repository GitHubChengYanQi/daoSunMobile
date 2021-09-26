import { Form, FormItem, Input, List, TextArea } from 'weui-react-v2';
import { NoticeBar } from 'antd-mobile';

const CreateRepair = () => {
  return(
    <>
      <NoticeBar marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }}>
        欢迎使用道昕智造一键报修系统
      </NoticeBar>
      <Form labelWidth="30vw"
            defaultModel={{
              company: "a公司",
              sbName:"b设备",
              brand: "波司登",
              pct:"辽宁省鞍山市",
              address:"c地址",
              number: "111111",
              name: "d",
              position:"经理",
              phone:"18899994444",
              type: "设备报修",
              imgs:"",
              date: "2021-09-09 10:30:00",
              time: "2021-09-09 10:30:00",
              feedback: "11111111111111111111111111111111",
            }}
      >
        <List title="使用单位">
          <FormItem  prop="company"  label="公司名称" >
            <Input placeholder="请输入设备名称" maxlength={10} disabled/>
          </FormItem >
        </List>
        <List title="报修设备信息">
          <FormItem  prop="sbName"  label="名称" >
            <Input placeholder="请输入设备名称" maxlength={10} disabled/>
          </FormItem >
          <FormItem   prop="brand"  label='品牌'  >
            <Input placeholder="请输入品牌" maxlength={10} disabled/>
          </FormItem>
          <FormItem  prop="time"  label='到货时间' >
            {/*<DatePicker placeholder="请选择到货时间" useDefaultFormat={false} separator="" disabled/>*/}
            <Input placeholder="请输入到货时间" maxlength={10} disabled/>
          </FormItem>
          <FormItem  prop="number"  label='出场编号' >
            <Input placeholder="请输入详出场编号" maxlength={10} disabled/>
          </FormItem>
        </List>
        <List title="问题描述">
          <FormItem prop="feedback"  alignItems="flex-start">
            <TextArea placeholder="请输入您遇到的问题" disabled/>
          </FormItem>
        </List>
        <List title="联系人信息">
          <FormItem  prop="name"  label='联系人信息'  >
            <Input placeholder="请输入联系人信息" maxlength={10} disabled/>
          </FormItem>
          <FormItem  prop="position"  label='职务' >
            <Input placeholder="请输入职务" maxlength={10}disabled />
          </FormItem>
          <FormItem prop="phone"  label='联系电话'  >
            <Input placeholder="请输入联系电话"  type="phone" pattern="[0-9]*" maxlength={13}  disabled/>
          </FormItem>
        </List>
        <List title="派工信息">
          <FormItem  prop="name"  label='工程师'  >
            {/*<Picker title="请选择" placeholder="请选择"  data={serviceTypes}/>*/}
            <Input placeholder="请输入派工信息" disabled/>
          </FormItem>
          <FormItem prop="phone"  label='联系电话'  >
            <Input placeholder="请输入联系电话"  type="phone" pattern="[0-9]*" maxlength={13} disabled/>
          </FormItem>
          <FormItem prop="date" label="到达时间">
            {/*<DatePicker placeholder="请输入预计到达时间" useDefaultFormat={false} separator="" disabled/>*/}
            <Input placeholder="请输入到达时间" disabled/>
          </FormItem>
          <FormItem prop="address"  label='区域'  >
            <Input placeholder="请输入服务区域" disabled/>
          </FormItem>
        </List>

        {/*<FormItem prop="type" label="服务类型" arrow={true}>*/}
        {/*  <Picker title="请选择" placeholder="请选择"  data={serviceTypes}/>*/}
        {/*</FormItem>*/}

      </Form>

    </>
  );
};
export default CreateRepair;
