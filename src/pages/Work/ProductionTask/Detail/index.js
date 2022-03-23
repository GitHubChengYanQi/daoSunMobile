import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../util/Request';
import { productionTaskDetail } from '../../Production/components/Url';
import { MyLoading } from '../../../components/MyLoading';
import MyEmpty from '../../../components/MyEmpty';
import { Card, Space, Tabs } from 'antd-mobile';
import styles from '../../Production/index.css';
import Label from '../../../components/Label';
import SkuList from '../../Production/components/SkuList';
import ShipList from '../../Production/components/ShipList';
import MyNavBar from '../../../components/MyNavBar';
import MyFloatingPanel from '../../../components/MyFloatingPanel';
import BottomButton from '../../../components/BottomButton';

const Detail = (props) => {
  const params = props.location.query;

  const { loading, data, run } = useRequest(productionTaskDetail, { manual: true });

  const [key, setKey] = useState('out');

  useEffect(() => {
    if (params.id) {
      run({ data: { productionTaskId: params.id } });
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
      title='基本信息'
      className={styles.mainDiv}
      style={{ backgroundColor: '#fff', height: 'auto' }}>
      <Space direction='vertical'>
        <div>
          <Label>任务编码：</Label>{data.coding}
        </div>
        <div>
          <Label>任务状态：</Label>{data.status}
        </div>
        <div>
          <Label>任务名称：</Label>{data.productionTaskName}
        </div>
        <div>
          <Label>工序：</Label>{data.shipSetpId}
        </div>
        <div>
          <Label>执行数量：</Label> {data.number}
        </div>
        <div>
          <Label>标准作业指导：</Label>{data.sopId}
        </div>
        <div>
          <Label>执行时间：</Label>{data.productionTime}
        </div>
        <div>
          <Label>负责人：</Label>{data.userId}
        </div>
        <div>
          <Label>成员：</Label>{data.userIds}
        </div>
        <div>
          <Label>分派人：</Label>{data.remark}
        </div>
        <div>
          <Label>分派时间：</Label>{data.createTime}
        </div>
        <div>
          <Label>备注：</Label>{data.remake}
        </div>
      </Space>
    </Card>;
  };

  const module = () => {
    switch (key) {
      case 'out':
        return <MyEmpty />;
      case 'in':
        return <MyEmpty />;
      case 'use':
        return <MyEmpty />;
      default:
        return <></>;
    }
  };

  return <div>
    <MyNavBar title='工单详情' />
    <div>
      <MyFloatingPanel backgroundColor backgroundDom={backgroundDom()}>
        <Tabs
          activeKey={key}
          style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 999 }}
          onChange={setKey}
        >
          <Tabs.Tab title='产出明细' key='out' />
          <Tabs.Tab title='投入明细' key='in' />
          <Tabs.Tab title='领用明细' key='use' />
        </Tabs>
        <div style={{ backgroundColor: '#eee' }}>
          {module()}
        </div>
      </MyFloatingPanel>
    </div>
    <BottomButton only text='产出报工' />
  </div>;
};

export default Detail;
