import React, { useState } from 'react';
import style from '../../../PurchaseOrderInstock/index.less';
import { CalendarOutline, RightOutline } from 'antd-mobile-icons';
import { Picker } from 'antd-mobile';
import User from '../User';
import MyDatePicker from '../../../../../../../../components/MyDatePicker';
import Number from '../../../../../../../../components/Number';

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

    <div className={style.dataItem}>
      <div className={style.title}>任务时间 <span>*</span></div>
      <div>
        <MyDatePicker precision='second' show={value.time || <CalendarOutline />} onChange={(time) => {
          onChange({ ...value, time });
        }} />
      </div>
    </div>

    <div className={style.dataItem}>
      <div className={style.title}>养护类型 <span>*</span></div>
      <div onClick={() => {
        setTypeVisible(true);
      }}>
        {value.typeName || '请选择'}<RightOutline />
      </div>
    </div>

    <div className={style.dataItem}>
      <div className={style.title}>养护临近 <span>*</span></div>
      <div className={style.nearMaintenance}>
        <Number width={70} noBorder value={value.nearMaintenance} onChange={(number) => {
          onChange({ ...value, nearMaintenance: number });
        }} />天
      </div>
    </div>

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
