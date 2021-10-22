import React  from 'react';
import { useRequest } from '../../../util/Request';
import { Button, Card, Form, Image, List } from 'antd-mobile';
import { router } from 'umi';

const { Item: ListItem } = List;

const EngineerImp = (props) => {


  const { repairId, select, repairList } = props;


  const { run: saveState } = useRequest({
    url: '/api/updateRepair',
    method: 'POST',
  }, {
    manual: true,
    onSuccess:()=>{
      // router.push(`/Repair/RepairList?id=${repairId}&select=${select}`);
      router.goBack();
    }
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

      <Form
        footer={
          <Button
            style={{ display: !select && (!repairList.power && 'none'),width:'100%' }}
            onClick={() => {
              saveState({
                data: {
                  progress: 3,
                  repairId: repairId,
                  type: 2,
                },
              });
            }}>确定到达</Button>
        }
      />


    </div>
  );
};
export default EngineerImp;
