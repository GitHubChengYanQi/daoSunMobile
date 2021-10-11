import {
  Form,
  FormItem,
  Input,
  List,
  SingleUpload,
  TextArea,
} from 'weui-react-v2';

const EngineerRepair = () =>{
  // let serviceTypes = [{value:1,label: '设备安装'}, {value: 2, label: '设备维修'}, {value: 3, label: '配件更换'}];
  return(
    <>
      <Form labelWidth="30vw"
        defaultModel={{
          company: "a公司",
          sbName:"b设备",
          pct:"辽宁省鞍山市",
          address:"c地址",
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
        <List title="使用单位信息">
          <FormItem  prop="company"  label="公司名称" >
            <Input placeholder="请输入公司名称" maxlength={10} disabled/>
          </FormItem >
          <FormItem   prop="sbName"  label='设备名称'  >
            <Input placeholder="请输入设备名称" maxlength={10} disabled/>
          </FormItem>
          <FormItem  prop="pct"  label='省市区' >
            <Input placeholder="请输入省市区" maxlength={10} disabled/>
          </FormItem>
          <FormItem  prop="address"  label='详细地址' >
            <Input placeholder="请输入详细地址" maxlength={10} disabled/>
          </FormItem>
          <FormItem  prop="name"  label='姓名'  >
            <Input placeholder="请输入姓名" maxlength={10} disabled />
          </FormItem>
          <FormItem  prop="position"  label='职务' >
            <Input placeholder="请输入职务" maxlength={10} disabled/>
          </FormItem>
          <FormItem prop="phone"  label='联系电话'  >
            <Input placeholder="请输入联系电话"  type="phone" pattern="[0-9]*" maxlength={13} disabled />
          </FormItem>
        </List>
        <List title="报修照片">
          <FormItem prop="imgs" >
            <SingleUpload style={{ marginLeft: '30px' }} action="/upload"  disabled/>
          </FormItem>
        </List>
        <List title="服务类型">
          <FormItem prop="type" label="服务类型" arrow={true}>
            <Input placeholder="请输入职务" maxlength={10} disabled/>
            {/*<Picker title="请选择" placeholder="请选择"  data={serviceTypes}/>*/}
          </FormItem>
          <FormItem prop="date" label="期望到达时间">
            <Input placeholder="请输入职务" maxlength={10} disabled/>
            {/*<DatePicker placeholder="请选择期望到达时间" useDefaultFormat={false} separator="" />*/}
          </FormItem>
        </List>
        <List title="描述">
          <FormItem prop="feedback" alignItems="flex-start">
            <TextArea placeholder="请输入您遇到的问题" disabled/>
          </FormItem>
        </List>
      </Form>
    </>
  );
};

export default EngineerRepair;
