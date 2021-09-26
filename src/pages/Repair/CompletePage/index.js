import { DatePicker, Form, FormItem, Input, List, SingleUpload, TextArea } from 'weui-react-v2';

const CompletePage =() =>{
  return(
    <>

      <Form labelWidth="30vw"
            defaultModel={{
              company: "a公司",
              sbName:"b设备",
              brand: "波司登",
              pct:"辽宁省鞍山市",
              address:"c地址",
              number: "111111",
              name: '张三',
              position:"经理",
              phone:"18899994444",
              type: "设备报修",
              imgs:"",
              date: "2021-09-09 10:30:00",
              time: "2021-09-09 10:30:00",
              rates: 3,
              feedback: "11111111111111111111111111111111",
              comment: "服务态度一般"
            }}
      >
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
        <List title="需求类型">
          <FormItem  prop="name"  label='联系人信息'  >
            <Input placeholder="请输入联系人信息" maxlength={10} disabled/>
          </FormItem>
        </List>
        <List title="问题描述">
          <FormItem prop="feedback"  alignItems="flex-start">
            <TextArea placeholder="请输入您遇到的问题" disabled/>
          </FormItem>
        </List>
        <List title="派工信息">
          <FormItem  prop="name"  label='工程师'  >
              {/*<Picker title="请选择" placeholder="请选择"  data={serviceTypes}/>*/}
            <Input placeholder="请输入工程师" maxlength={10} disabled/>
          </FormItem>
          <FormItem prop="phone"  label='联系电话'  >
            <Input placeholder="请输入联系电话"  type="phone" pattern="[0-9]*" maxlength={13}  disabled/>
          </FormItem>
        </List>
        <List title="完成照片">
          <FormItem prop="imgs" >
            <SingleUpload style={{ marginLeft: '30px' }} action="/upload"  disabled/>
          </FormItem>
        </List>
        <List title="完成描述">
          <FormItem prop="feedback"  alignItems="flex-start">
            <TextArea placeholder="请输入您遇到的问题" disabled/>
          </FormItem>
        </List>
      </Form>
    </>
  );
};
export default CompletePage;
