import React from 'react';
import { useRequest } from '../../../util/Request';
import { Button, Card, Divider, Form, Image, List, Rate } from 'antd-mobile';
import { TextArea } from 'weui-react-v2';
import { router } from 'umi';

const { Item: ListItem } = List;

const EvaluationPage = (props) => {

  const { repairId, repairList,state } = props;




  const { run: dispatchingUpdate } = useRequest({
    url: '/api/dispatchingUpdate',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: async () => {
      await saveState({
        data: { progress: 5, repairId: repairId, type: 4 },
      });
    },
  });

  const { run: saveState } = useRequest({
    url: '/api/updateRepair',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: async () => {
      router.goBack();
    },
  });


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
      {
        repairList.dispatchingResults
          ?
          <>
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
              <ListItem
                title='完成图片'
              >
                <Image width={200}
                       src={repairList.dispatchingResults.length > 0 && repairList.dispatchingResults[0].imgUrl} />
              </ListItem>
              <ListItem
                title='描述'
              >
                {repairList.dispatchingResults.length > 0 && repairList.dispatchingResults[0].note}
              </ListItem>
            </Card>
          </>
          :
          <>无工程师信息！</>
      }

      <Card title='评价'>
        {
          state
            ?
            <>
              <ListItem
                title='评分'
              >
                <Rate defaultValue={repairList.dispatchingResults.length > 0 && repairList.dispatchingResults[0].evaluations} readonly />
              </ListItem>
              <ListItem
                title='其他评价'
              >
                {repairList.dispatchingResults.length > 0 && repairList.dispatchingResults[0].evaluation}
              </ListItem>
            </>
            :
            <Form
              onFinish={async (values) => {
                await dispatchingUpdate(
                  {
                    data: {
                      ...values,
                      dispatchingId: repairList && repairList.dispatchingResults && repairList.dispatchingResults[0].dispatchingId,
                    },
                  },
                );
              }}
              footer={
                <Button
                  type='submit'
                  style={{ width: '100%' }}>提交</Button>
              }
            >
              <Form.Item label='评分' name='evaluations' rules={[{ required: true, message: '该字段是必填字段！' }]}>
                <Rate defaultValue={3} />
              </Form.Item>

              <Form.Item label='其他评价' name='evaluation' rules={[{ required: true, message: '该字段是必填字段！' }]}>
                <TextArea placeholder='请输入其他评价' />
              </Form.Item>

            </Form>
        }

      </Card>

      {
        state &&  <Divider
          style={{
            padding:8,
            paddingBottom:16,
            color: '#1677ff',
            borderColor: '#1677ff',
            borderStyle: 'dashed',
          }}
        >
          恭喜已完成报修！
        </Divider>
      }

    </div>
  );
};
export default EvaluationPage;
