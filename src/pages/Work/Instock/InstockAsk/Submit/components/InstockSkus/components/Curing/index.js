import React, { useState } from 'react';
import style from '../../../PurchaseOrderInstock/index.less';
import { CalendarOutline, RightOutline } from 'antd-mobile-icons';
import { Picker, Space } from 'antd-mobile';
import User from '../User';
import Number from '../../../../../../../../components/Number';
import StartEndDate from '../../../../../../../Production/CreateTask/components/StartEndDate';
import Title from '../../../../../../../../components/Title';
import MyCard from '../../../../../../../../components/MyCard';

const Curing = (
  {
    value = {},
    onChange = () => {
    },
  },
) => {


  const [typeVisible, setTypeVisible] = useState();

  return <>
    <User id={value.userId} name={value.userName} onChange={(id, name) => {
      onChange({ ...value, userId: id, userName: name });
    }} title='负责人' />

    <MyCard
      titleBom={<Title className={style.title}>任务时间 <span>*</span></Title>}
      extra={<div>
        <StartEndDate
          min={new Date()}
          value={[value.startTime, value.endTime]}
          onChange={(dates) => {
            onChange({ ...value, startTime: dates[0], endTime: dates[1] });
          }}
        />
      </div>}
    />

    <MyCard
      titleBom={ <Title className={style.title}>养护类型 <span>*</span></Title>}
      extra={  <div onClick={() => {
        setTypeVisible(true);
      }}>
        {value.typeName || '请选择'}<RightOutline />
      </div>}
    />

    <MyCard
      titleBom={<Title className={style.title}>养护临近 <span>*</span></Title>}
      extra={<div className={style.nearMaintenance}>
        <Number width={70} noBorder value={value.nearMaintenance} onChange={(number) => {
          onChange({ ...value, nearMaintenance: number });
        }} />天
      </div>}
    />

    <Picker
      columns={[[{ label: '复检复调', value: 'check' }]]}
      visible={typeVisible}
      onClose={() => setTypeVisible(false)}
      onConfirm={(val, options) => {
        const item = options.items[0] || {};
        onChange({ ...value, type: item.value, typeName: item.label });
      }}
    />

  </>;
};

export default Curing;
