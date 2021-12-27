import React from 'react';
import { useRequest } from '../../../util/Request';
import { Button, Card, Form, Image, List } from 'antd-mobile';
import { history } from 'umi';

const { Item:ListItem } = List;

const Engineer = (props) => {

  const { repairId,repairList,select } = props;

  const { run: saveState } = useRequest({
    url: '/api/updateRepair',
    method: 'POST',
  }, {
    manual: true,
    onSuccess:()=>{
      history.goBack();
    }
  });

  if (!(repairId && repairList)) {
    return null;
  }

  return (
    <div>
      <Card title='使用单位信息'>
        <ListItem
          title='公司名称'
        >
          { repairList.customerResult && repairList.customerResult.customerName}
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
          {repairList.regionResult && [0] && repairList.regionResult[0].province + '/' + repairList.regionResult[0].city + '/' + repairList.regionResult[0].area}
        </ListItem>
        <ListItem title='详细地址'>
          { repairList.address}
        </ListItem>
        <ListItem title='姓名'>
          { repairList.people}
        </ListItem>
        <ListItem title='职务'>
          { repairList.position}
        </ListItem>
        <ListItem title='联系电话'>
          { repairList.telephone}
        </ListItem>
      </Card>
      <Card title='报修信息'>
        <ListItem title='报修照片'>
          { repairList.bannerResult && repairList.bannerResult.map((item, index) => {
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
          { repairList.serviceType }
        </ListItem>
        <ListItem title='期望到达时间'>
          { repairList.expectTime }
        </ListItem>
        <ListItem title='描述'>
          { repairList.comment}
        </ListItem>
      </Card>
      <Card title='维保人员信息'>
        <ListItem
          title='工程师姓名'
        >
          { repairList.dispatchingResults.length > 0 && repairList.dispatchingResults[0].userName}
        </ListItem>
        <ListItem
          title='手机号'
        >
          { repairList.dispatchingResults.length > 0 && repairList.dispatchingResults[0].phone}
        </ListItem>
        <ListItem
          title='派单时间'
        >
          { repairList.dispatchingResults.length > 0 && repairList.dispatchingResults[0].time}
        </ListItem>
      </Card>
      <div style={{margin:8}}>请按时抵达客户公司，若有变更请联系电话：{repairList.telephone}</div>

      <Form
        footer={
          <Button
            style={{ width:'100%', display: !select && (!repairList.power && 'none') }}
            onClick={() => {
              saveState({
                data:{
                  progress: 2,
                  repairId: repairId,
                }
              });
            }}>确定接单</Button>
        }
      />

    </div>
  );
};
export default Engineer;
