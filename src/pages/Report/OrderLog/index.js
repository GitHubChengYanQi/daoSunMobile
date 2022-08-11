import React from 'react';
import { TextOutline } from 'antd-mobile-icons';
import { MyDate } from '../../components/MyDate';
import style from './index.less';
import { CloudDownloadOutlined } from '@ant-design/icons';
import MyNavBar from '../../components/MyNavBar';
import MyCard from '../../components/MyCard';
import { UserName } from '../../components/User';

const OrderLog = () => {


  const typeContent = () => {
    switch (1) {
      default:
        return {
          title: 'xxx',
        };
    }
  };

  return <>
    <MyNavBar title={`${typeContent().title}记录单`} />
    <div className={style.header}>
      <div className={style.info}>
        <TextOutline />
        <div>
          <div>{`${typeContent().title}记录单`} / qweqwwq</div>
          <div className={style.time}>{MyDate.Show(new Date())}</div>
        </div>
      </div>
      <CloudDownloadOutlined />
    </div>

    <div style={{ height: 3 }} />

    <MyCard title={`${typeContent().title}明细`}>

    </MyCard>

    <MyCard title='执行人' extra={<UserName />} />

    <MyCard title='提交人' extra={<UserName />} />

    <MyCard title='领料人' extra='无' />

    <MyCard title='仓库' extra='无' />

    <MyCard title='调出仓库' extra='无' />

    <MyCard title='出货人' extra='无' />

    <MyCard title='调入仓库' extra='无' />

    <MyCard title='收货人' extra='无' />

    <MyCard title='来源' extra='无' />

    <MyCard title='提报时间' extra='无' />

    <MyCard title='审批人'>

    </MyCard>
  </>;
};

export default OrderLog;
