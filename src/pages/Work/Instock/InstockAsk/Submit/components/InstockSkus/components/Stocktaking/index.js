import React from 'react';
import style from '../../../PurchaseOrderInstock/index.less';
import { Switch } from 'antd-mobile';
import User from '../User';
import StartEndDate from '../../../../../../../Production/CreateTask/components/StartEndDate';
import Title from '../../../../../../../../components/Title';
import MyCard from '../../../../../../../../components/MyCard';

const Stocktaking = (
  {
    value = {},
    onChange = () => {
    },
  },
) => {

  return <>

    <MyCard
      titleBom={<Title className={style.title}>时间 <span>*</span></Title>}
      extra={<StartEndDate
        value={[value.beginTime, value.endTime]}
        onChange={(dates) => {
          onChange({ ...value, beginTime: dates[0], endTime: dates[1] });
        }}
      />}
    />

    <User id={value.userId} name={value.userName} onChange={(id, name) => {
      onChange({ ...value, userId: id, userName: name });
    }} title='负责人' />

    <User title='参与人' id={value.participantsId} name={value.participantsName} onChange={(id, name) => {
      onChange({ ...value, participantsId: id, participantsName: name });
    }} />

    <MyCard
      title='方式'
      extra={<div className={style.method}>
        <Switch checked={value.method === 'OpenDisc'} checkedText='明盘' uncheckedText='暗盘' onChange={(checked) => {
          onChange({ ...value, method: checked ? 'OpenDisc' : 'DarkDisk' });
        }} />
      </div>}
    />

    <MyCard
      title='方法'
      extra={<div className={style.mode}>
        <Switch checked={value.mode === 'staticState'} checkedText='静态' uncheckedText='动态' onChange={(checked) => {
          onChange({ ...value, mode: checked ? 'staticState' : 'dynamic' });
        }} />
      </div>}
    />
  </>;
};

export default Stocktaking;
