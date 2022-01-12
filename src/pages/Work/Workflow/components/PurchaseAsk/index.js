import React, { useState } from 'react';
import MyEmpty from '../../../../components/MyEmpty';
import { Button, Card, Divider, List, Popup } from 'antd-mobile';
import SkuResultSkuJsons from '../../../../Scan/Sku/components/SkuResult_skuJsons';

const PurchaseAsk = ({ detail }) => {

  const [visible, setVisible] = useState(false);

  if (!detail)
    return <MyEmpty />;

  const sku = (items) => {
    return <>
      <SkuResultSkuJsons skuResult={items.skuResult} />
    </>;
  };


  return <>
    <Divider contentPosition='left'>采购申请信息</Divider>
    <>
      <List.Item>采购申请编码：{detail.coding}
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
      <List.Item>创建人：{detail.createUserName || '无'}</List.Item>
      <List.Item>备注：{detail.remark || '无'}</List.Item>
      <List.Item>创建时间：{detail.createTime}</List.Item>

      <Popup
        visible={visible}
        onMaskClick={() => {
          setVisible(false);
        }}
      >
        <Card title='质检信息' bodyStyle={{ maxHeight: '50vh', overflowY: 'scroll', padding: 16 }}>
          {
            detail.purchaseListingResults
              ?
              detail.purchaseListingResults.map((items, index) => {
                return <List.Item
                  key={index}
                  description={
                    <>
                      申请数量: {items.applyNumber} &nbsp;&nbsp; 可用数量: {items.availableNumber}
                      <br />
                      交付日期:{items.deliveryDate} &nbsp;&nbsp;备注：{items.note || '无'}
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

export default PurchaseAsk;
