import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../util/Request';
import { productionTaskDetail } from '../../Production/components/Url';
import { MyLoading } from '../../../components/MyLoading';
import MyEmpty from '../../../components/MyEmpty';
import { Card, List, Space, Tabs } from 'antd-mobile';
import styles from '../../Production/index.css';
import Label from '../../../components/Label';
import MyNavBar from '../../../components/MyNavBar';
import MyFloatingPanel from '../../../components/MyFloatingPanel';
import BottomButton from '../../../components/BottomButton';
import SkuResult_skuJsons from '../../../Scan/Sku/components/SkuResult_skuJsons';

const Detail = (props) => {
  const params = props.location.query;

  const { loading, data, run } = useRequest(productionTaskDetail, { manual: true });

  console.log(data);

  const setpSetResult = data.workOrderResult
    &&
    data.workOrderResult.setpSetResult
    &&
    data.workOrderResult.setpSetResult.shipSetpResult
    &&
    data.workOrderResult.setpSetResult || {};

  const shipSetpResult = setpSetResult.shipSetpResult || {};

  const setpSetDetails = setpSetResult.setpSetDetails || [];

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
          <Label>工序：</Label>{shipSetpResult.shipSetpName}
        </div>
        <div>
          <Label>执行数量：</Label> {data.number}
        </div>
        <div>
          <Label>标准作业指导：</Label>{shipSetpResult.sopResult && shipSetpResult.sopResult.name}
        </div>
        <div>
          <Label>执行时间：</Label>{data.productionTime}
        </div>
        <div>
          <Label>结束时间：</Label>{data.endTime}
        </div>
        <div>
          <Label>负责人：</Label>{data.userResult && data.userResult.name}
        </div>
        <div>
          <Label>成员：</Label>{data.userResults && data.userResults.map((item) => {
          return item.name;
        }).join(',')}
        </div>
        <div>
          <Label>分派人：</Label>{data.createUserResult && data.createUserResult.name}
        </div>
        <div>
          <Label>分派时间：</Label>{data.createTime}
        </div>
        <div>
          <Label>备注：</Label>{data.remark}
        </div>
      </Space>
    </Card>;
  };

  const module = () => {
    switch (key) {
      case 'out':
        return setpSetDetails.length === 0
          ?
          <MyEmpty />
          :
          <List>
            {
              setpSetDetails.map((item, index) => {
                const skuResult = item.skuResult || {};
                return <List.Item key={index}>
                  <SkuResult_skuJsons skuResult={skuResult} />
                </List.Item>;
              })
            }
          </List>;
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
