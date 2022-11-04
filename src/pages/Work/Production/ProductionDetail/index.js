import React, { useEffect, useState } from 'react';
import { productionPlanDetail } from '../components/Url';
import { useRequest } from '../../../../util/Request';
import { Tabs } from 'antd-mobile';
import { MyLoading } from '../../../components/MyLoading';
import MyEmpty from '../../../components/MyEmpty';
import MyNavBar from '../../../components/MyNavBar';
import SkuList from '../components/SkuList';
import ShipList from '../components/ShipList';
import style from './index.less';
import { Avatar } from 'antd';
import Icon from '../../../components/Icon';
import { MyDate } from '../../../components/MyDate';

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

  const user = data.userResult || {};

  return <div>
    <MyNavBar title='工单详情' />
    <div className={style.header}>
      <Avatar className={style.avatar} src={user.avatar} size={60}>
        {user.name && user.name.substring(0, 1)}
      </Avatar>
      <div className={style.data}>
        <div className={style.line}>
          <div className={style.name}>
            {data.theme} / {data.coding}
          </div>
          <span>
          <Icon type='icon-dian' /> 处理中
        </span>
        </div>
        <div className={style.line}>
          {MyDate.Show(data.executionTime)} - {MyDate.Show(data.endTime)}
        </div>
      </div>
    </div>


    <Tabs
      activeKey={key}
      style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 999 }}
      onChange={setKey}
    >
      <Tabs.Tab title='生产工序' key='ship' />
      <Tabs.Tab title='生产信息' key='sku' />
    </Tabs>
    <div>
      {module()}
    </div>
  </div>;
};

export default ProductionDetail;
