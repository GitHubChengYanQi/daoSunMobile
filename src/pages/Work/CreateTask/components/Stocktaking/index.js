import React from 'react';
import style from '../../../Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import User from '../User';
import StartEndDate from '../../../Production/CreateTask/components/StartEndDate';
import Title from '../../../../components/Title';
import MyCard from '../../../../components/MyCard';
import MySwitch from '../../../../components/MySwitch';

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
        min={new Date()}
        value={[value.beginTime, value.endTime]}
        onChange={(dates) => {
          onChange({ ...value, beginTime: dates[0], endTime: dates[1] });
        }}
      />}
    />

    <User
      value={value.userId ? [{
        id: value.userId,
        name: value.userName,
        avatar: value.avatar,
      }] : []}
      onChange={(users) => {
        const { id, name, avatar } = users[0] || {};
        onChange({ ...value, userId: id, userName: name, avatar });
      }}
      title='负责人'
    />

    <User
      noRequired
      multiple
      title='参与人'
      value={value.participants}
      onChange={(users) => {
        onChange({ ...value, participants: users });
      }} />

    <MyCard
      title='明盘'
      extra={<div className={style.method}>
        <MySwitch
          checked={value.method === 'OpenDisc'}
          onChange={(checked) => {
            onChange({ ...value, method: checked ? 'OpenDisc' : 'DarkDisk' });
          }} />
      </div>}
    />

    {value.all && <MyCard
      title='静态'
      extra={<div className={style.mode}>
        <MySwitch
          checked={value.mode === 'staticState'}
          onChange={(checked) => {
            onChange({ ...value, mode: checked ? 'staticState' : 'dynamic' });
          }} />
      </div>}
    />}
  </>;
};

export default Stocktaking;
