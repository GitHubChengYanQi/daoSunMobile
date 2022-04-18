import React, { useEffect, useState } from 'react';
import { productionPlanDetail } from '../components/Url';
import { useRequest } from '../../../../util/Request';
import { Card, Space, Tabs } from 'antd-mobile';
import { MyLoading } from '../../../components/MyLoading';
import MyEmpty from '../../../components/MyEmpty';
import MyNavBar from '../../../components/MyNavBar';
import MyFloatingPanel from '../../../components/MyFloatingPanel';
import Label from '../../../components/Label';
import SkuList from '../components/SkuList';
import ShipList from '../components/ShipList';
import { getHeader } from '../../../components/GetHeader';

const ProductionDetail = (props) => {
  const params = props.location.query;

  const { loading, data, run } = useRequest(productionPlanDetail, { manual: true });

  const [key, setKey] = useState('ship');

  useEffect(() => {
    if (params.id) {
      run({ data: { productionPlanId: params.id } });
    }
  }, []);


  if (loading) {
    return <MyLoading />;
  }

  if (!data) {
    return <MyEmpty />;
  }

  const backgroundDom = () => {

    return <Card
      title={<div><Label>工单主题：</Label>{data.theme}</div>}
      style={{ backgroundColor: '#fff', }}>
      <Space direction='vertical'>
        <div>
          <Label>工单编号：</Label>{data.coding}
        </div>
        <div>
          <Label>执行开始时间：</Label>{data.executionTime}
        </div>
        <div>
          <Label>执行结束时间：</Label> {data.endTime}
        </div>
        <div>
          <Label>负责人：</Label>{data.userResult && data.userResult.name}
        </div>
        <div>
          <Label>备注：</Label>{data.remark}
        </div>
        <Space>
          <Label>创建时间：</Label>{data.createTime}
        </Space>
      </Space>
    </Card>;
  };

  const module = () => {
    switch (key) {
      case 'sku':
        return <SkuList data={data.planDetailResults} />;
      case 'ship':
        return <ShipList data={data.workOrderResults} id={params.id} />;
      default:
        return <></>;
    }
  };

  return <div>
    <MyNavBar title='工单详情' />
    <MyFloatingPanel
      maxHeight={window.innerHeight - (getHeader() ? 52 : 97)}
      backgroundDom={backgroundDom()}>
      <Tabs
        activeKey={key}
        style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 999 }}
        onChange={setKey}
      >
        <Tabs.Tab title='生产工序' key='ship' />
        <Tabs.Tab title='生产信息' key='sku' />
      </Tabs>
      <div style={{ backgroundColor: '#eee' }}>
        {module()}
      </div>
    </MyFloatingPanel>
  </div>;
};

export default ProductionDetail;
