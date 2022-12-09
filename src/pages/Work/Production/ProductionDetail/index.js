import React, { useEffect, useState } from 'react';
import { productionPlanDetail } from '../components/Url';
import { useRequest } from '../../../../util/Request';
import { Tabs } from 'antd-mobile';
import { MyLoading } from '@/pages/components/MyLoading';
import MyEmpty from '../../../components/MyEmpty';
import MyNavBar from '../../../components/MyNavBar';
import SkuList from '../components/SkuList';
import ShipList from '../components/ShipList';
import style from './index.less';
import { Avatar } from 'antd';
import Icon from '../../../components/Icon';
import Details from './components/Details';
import PlanDetails from './components/PlanDetails';
import Log from './components/Log';
import Relation from './components/Relation';

const ProductionDetail = (props) => {

  const params = props.location.query;

  const { loading, data, run } = useRequest(productionPlanDetail, { manual: true });

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

  const user = data.userResult || {};

  return <div>
    <MyNavBar title='计划详情' />
    <div className={style.header}>
      <Avatar className={style.avatar} src={user.avatar} size={60}>
        {user.name && user.name.substring(0, 1)}
      </Avatar>
      <div className={style.data}>
        <div className={style.line}>
          <div className={style.name}>
            {data.theme}
          </div>
          <span>
          <Icon type='icon-dian' /> 处理中
        </span>
        </div>
        <div className={style.line}>
          <div>{data.coding}</div>
          <span style={{ color: '#555555' }}>{data.createTime}</span>
        </div>
      </div>
    </div>


    <Tabs
      className={style.tabs}
      defaultActiveKey='details'
      style={{ position: 'sticky', top: 0, zIndex: 1, '--title-font-size': '14px' }}
    >
      <Tabs.Tab title='投产明细' key='details'>
        <Details data={data.planDetailResults} />
      </Tabs.Tab>
      <Tabs.Tab title='计划明细' key='planDetails'>
        <PlanDetails data={data} />
      </Tabs.Tab>
      <Tabs.Tab title='动态日志' key='log'>
        <Log />
      </Tabs.Tab>
      <Tabs.Tab title='关联单据' key='relation'>
        <Relation />
      </Tabs.Tab>
    </Tabs>
  </div>;
};

export default ProductionDetail;
