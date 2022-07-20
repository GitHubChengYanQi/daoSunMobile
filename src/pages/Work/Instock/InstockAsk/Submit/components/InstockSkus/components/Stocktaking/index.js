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
        min={new Date()}
        value={[value.beginTime, value.endTime]}
        onChange={(dates) => {
          onChange({ ...value, beginTime: dates[0], endTime: dates[1] });
        }}
      />}
    />

    <User id={value.userId} name={value.userName} onChange={(id, name) => {
      onChange({ ...value, userId: id, userName: name });
    }} title='负责人' />

    <User noRequired title='参与人' id={value.participantsId} name={value.participantsName} onChange={(id, name) => {
      onChange({ ...value, participantsId: id, participantsName: name });
    }} />

    <MyCard
      title='明盘'
      extra={<div className={style.method}>
        <Switch
          checked={value.method === 'OpenDisc'}
          style={{ '--height': '24px', '--width': '64px' }}
          onChange={(checked) => {
            onChange({ ...value, method: checked ? 'OpenDisc' : 'DarkDisk' });
          }} />
      </div>}
    />

    {value.all && <MyCard
      title='静态'
      extra={<div className={style.mode}>
        <Switch
          checked={value.mode === 'staticState'}
          style={{ '--height': '24px', '--width': '64px' }}
          onChange={(checked) => {
            onChange({ ...value, mode: checked ? 'staticState' : 'dynamic' });
          }} />
      </div>}
    />}
  </>;
};

export default Stocktaking;
