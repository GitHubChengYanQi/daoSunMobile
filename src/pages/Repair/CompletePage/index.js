import React  from 'react';
import { useRequest } from '../../../util/Request';
import { Button, Card, Form, Image, List } from 'antd-mobile';
import { TextArea } from 'weui-react-v2';
import UpLoadImg from '../../components/Upload';
import { history } from 'umi';

const { Item: ListItem } = List;

const CompletePage = (props) => {

  const { repairId, select, repairList } = props;

  const { run: saveState } = useRequest({
    url: '/api/updateRepair',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: () => {
      history.push('/Repair');
    },
  });



  const { run: dispatchingUpdate } = useRequest({
    url: '/api/dispatchingUpdate',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: () => {
      saveState({
        data: { progress: 4, repairId: repairId, type: 3 }});
    },
  });

  if (!(repairId && repairList)) {
    return null;
  }


  return (
    <div style={{ marginBottom: '150rpx' }}>
      <Card title='使用单位信息'>
        <ListItem
          title='公司名称'
        >
          {repairList.customerResult && repairList.customerResult.customerName}
        </ListItem>

        <ListItem title='设备名称'>
          {repairList.deliveryDetailsResult && repairList.deliveryDetailsResult.detailesItems && repairList.deliveryDetailsResult.detailesItems.name}
        </ListItem>
        <ListItem title='品牌'>
          {repairList.deliveryDetailsResult && repairList.deliveryDetailsResult.detailsBrand && repairList.deliveryDetailsResult.detailsBrand.brandName}
        </ListItem>
        <ListItem title='产品编号'>
          {repairList.deliveryDetailsResult && repairList.deliveryDetailsResult.stockItemId}
        </ListItem>
        <ListItem title='省市区'>
          {repairList.regionResult && [0] && repairList.regionResult[0].province + '/' + repairList.regionResult[0].city + '/' + repairList.regionResult[0].area}
        </ListItem>
        <ListItem title='详细地址'>
          {repairList.address}
        </ListItem>
        <ListItem title='姓名'>
          {repairList.people}
        </ListItem>
        <ListItem title='职务'>
          {repairList.position}
        </ListItem>
        <ListItem title='联系电话'>
          {repairList.telephone}
        </ListItem>
      </Card>
      <Card title='报修信息'>
        <ListItem title='报修照片'>
          {repairList.bannerResult && repairList.bannerResult.map((item, index) => {
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
          {repairList.serviceType}
        </ListItem>
        <ListItem title='期望到达时间'>
          {repairList.expectTime}
        </ListItem>
        <ListItem title='描述'>
          {repairList.comment}
        </ListItem>
      </Card>
      <Card title='维保人员信息'>
        <ListItem
          title='工程师姓名'
        >
          {repairList.dispatchingResults.length > 0 && repairList.dispatchingResults[0].userName}
        </ListItem>
        <ListItem
          title='手机号'
        >
          {repairList.dispatchingResults.length > 0 && repairList.dispatchingResults[0].phone}
        </ListItem>
        <ListItem
          title='派单时间'
        >
          {repairList.dispatchingResults.length > 0 && repairList.dispatchingResults[0].time}
        </ListItem>
      </Card>

      <Card title='完成信息'>
        <Form
          onFinish={async (values) => {
            await dispatchingUpdate(
              {
                data: {
                  ...values,
                  dispatchingId: repairList.dispatchingResults && repairList.dispatchingResults.length > 0 && repairList.dispatchingResults[0].dispatchingId,
                  state: 1,
                },
              },
            );
          }}
          footer={
            <Button
              type='submit'
              style={{ display: !select && (!repairList.power && 'none'), width: '100%' }}>提交</Button>
          }
        >
          <Form.Item label='完成照片' name='imgUrl' rules={[{ required: true, message: '该字段是必填字段！' }]}>
            <UpLoadImg />
          </Form.Item>

          <Form.Item label='完成描述' name='note' rules={[{ required: true, message: '该字段是必填字段！' }]}>
            <TextArea placeholder='请输入完成描述' />
          </Form.Item>

        </Form>
      </Card>
    </div>
  );
};
export default CompletePage;
