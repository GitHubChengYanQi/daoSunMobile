import React from 'react';
import style from '../../../Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import User from '../User';
import Title from '../../../../components/Title';
import MyCard from '../../../../components/MyCard';
import MySwitch from '../../../../components/MySwitch';
import StartEndDate from '../../../../components/StartEndDate';

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
        dept: value.dept,
        role: value.role,
      }] : []}
      onChange={(users) => {
        const { id, name, avatar, dept, role } = users[0] || {};
        onChange({ ...value, userId: id, userName: name, avatar, dept, role });
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
      }}
    />

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
