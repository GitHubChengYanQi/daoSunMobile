import React, { useEffect, useState } from 'react';
import { Button, Card, Divider, List, Popup, } from 'antd-mobile';
import MyEmpty from '../../../../components/MyEmpty';
import { useRequest } from '../../../../../util/Request';

const QualityTask = ({ detail }) => {

  const [visible, setVisible] = useState(false);

  const { data, run } = useRequest({
    url: '/qualityTaskDetail/list',
    method: 'POST',
  }, {
    manual: true,
  });

  const sku = (items) => {
    return <>
      {items.skuResult && items.skuResult.skuName}
      &nbsp;/&nbsp;
      {items.skuResult && items.skuResult.spuResult && items.skuResult.spuResult.name}
      &nbsp;&nbsp;
      <em style={{ color: '#c9c8c8', fontSize: 10 }}>
        (
        {
          items.skuResult
          &&
          items.skuResult.skuJsons
          &&
          items.skuResult.skuJsons.map((items, index) => {
            return (
              <span key={index}>{items.attribute.attribute}：{items.values.attributeValues}</span>
            );
          })
        }
        )
      </em>
    </>;
  };

  useEffect(() => {
    if (detail && detail.qualityTaskId)
      run({
        data: {
          qualityTaskId: detail.qualityTaskId,
        },
      });
  }, [detail, run]);

  if (!detail)
    return <MyEmpty />;

  console.log(data);

  return <>
    <Divider contentPosition='left'>质检任务信息</Divider>
    <>
      <List.Item>质检编码：{detail.coding}
        <Button
          color='primary'
          fill='none'
          style={{ padding: 0, float: 'right' }}
          onClick={() => {
            setVisible(true);
          }}
        >查看详情
        </Button>
      </List.Item>
      <List.Item>质检类型：{detail.type}</List.Item>
      <List.Item>负责人：{detail.user && detail.user.name || '无'}</List.Item>
      <List.Item>备注：{detail.remark || '无'}</List.Item>
      <List.Item>创建时间：{detail.createTime}</List.Item>

      <Popup
        visible={visible}
        onMaskClick={() => {
          setVisible(false);
        }}
      >
        <Card title='质检信息' bodyStyle={{ maxHeight: '50vh', overflowY: 'scroll',padding:16 }}>
          {
            data
              ?
              data.map((items, index) => {
                return <List.Item
                  key={index}
                  description={
                    <>
                      {items.brand && items.brand.brandName} &nbsp;&nbsp; × {items.number}
                      <br />
                      {items.qualityPlanResult && items.qualityPlanResult.planName + '  /  '}{items.batch ? `抽检${items.percentum}%` : '固定检查'}
                    </>
                  }
                >
                  {sku(items)}
                </List.Item>;
              })
              :
              <MyEmpty />
          }
        </Card>
      </Popup>
    </>
  </>;
};

export default QualityTask;
