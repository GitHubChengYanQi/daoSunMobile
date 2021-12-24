import React from 'react';
import { useRequest } from '../../../util/Request';
import { router } from 'umi';
import { Button, Card, Form, Image, List, Toast } from 'antd-mobile';
import { DatePicker, Input } from 'weui-react-v2';
import MyPicker from '../../components/MyPicker';
import { UserIdSelect } from '../RepairUrl';

const { Item: ListItem } = List;

const EngineerRepair = (props) => {

  const { repairId, user, repairList } = props;

  const { run: saveState } = useRequest({
    url: '/api/updateRepair',
    method: 'POST',
  }, {
    manual: true,
  });

  const { run: runSaveDispatching } = useRequest({
    url: '/api/saveDispatching',
    method: 'POST',
  }, {
    manual: true,
  });

  if (!(repairId && user && repairList)) {
    return null;
  }

  return (
    <div>
      <Card title='使用单位信息'>
        <ListItem
          title='公司名称'
        >
          {repairList && repairList.customerResult && repairList.customerResult.customerName}
        </ListItem>

        <ListItem title='设备名称'>
          {repairList.deliveryDetailsResult && repairList.deliveryDetailsResult.detailesItems && repairList.deliveryDetailsResult.detailesItems.name}
        </ListItem>
        <ListItem title='品牌'>
          { repairList.deliveryDetailsResult && repairList.deliveryDetailsResult.detailsBrand && repairList.deliveryDetailsResult.detailsBrand.brandName}
        </ListItem>
        <ListItem title='产品编号'>
          { repairList.deliveryDetailsResult && repairList.deliveryDetailsResult.stockItemId}
        </ListItem>
        <ListItem title='省市区'>
          {repairList.regionResult[0] && repairList.regionResult[0].province + '/' + repairList.regionResult[0].city + '/' + repairList.regionResult[0].area}
        </ListItem>
        <ListItem title='详细地址'>
          {repairList && repairList.address}
        </ListItem>
        <ListItem title='姓名'>
          {repairList && repairList.people}
        </ListItem>
        <ListItem title='职务'>
          {repairList && repairList.position}
        </ListItem>
        <ListItem title='联系电话'>
          {repairList && repairList.telephone}
        </ListItem>
      </Card>
      <Card title='报修信息'>
        <ListItem title='报修照片'>
          {repairList && repairList.bannerResult.map((item, index) => {
            return (
              <Image
                style={{ margin: 8 }}
                width={90}
                key={index}
                src={item.imgUrl}
              />
            );
          })}
        </ListItem>
        <ListItem title='服务类型'>
          {repairList ? repairList.serviceType : null}
        </ListItem>
        <ListItem title='期望到达时间'>
          {repairList ? repairList.expectTime : null}
        </ListItem>
        <ListItem title='描述'>
          {repairList && repairList.comment}
        </ListItem>
      </Card>
      <Card title='派工信息'>
        <Form
          onFinish={async (values) => {
            values = {
              ...values,
              createUser: user && user.userId,
              repairId: repairId,
            };
            await runSaveDispatching({ data: { ...values } });
            await saveState({
              data: {
                progress: 1,
                repairId: repairId,
                type:1,
              },
            }).then(() => {
              Toast.show({
                content: '派工成功！',
                position: 'bottom',
              });
              router.goBack();
            });
          }}
          footer={
            <Button type='submit' style={{ display: !repairList.power && 'none', width: '100%' }}>派工</Button>
          }
        >
          <Form.Item label='工程师' name='name' rules={[{ required: true, message: '该字段是必填字段！' }]}>
            <MyPicker api={UserIdSelect} />
          </Form.Item>

          <Form.Item label='联系电话' name='phone' rules={[{ required: true, message: '该字段是必填字段！' }]}>
            <Input placeholder='请输入联系电话' />
          </Form.Item>

          <Form.Item label='到达时间' name='time' rules={[{ required: true, message: '该字段是必填字段！' }]}>
            <DatePicker />
          </Form.Item>

          <Form.Item label='负责区域' name='address' rules={[{ required: true, message: '该字段是必填字段！' }]}>
            <Input placeholder='请输入负责区域' />
          </Form.Item>

        </Form>
      </Card>
    </div>
  );
};
export default EngineerRepair;
