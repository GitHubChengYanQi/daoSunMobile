import React, { useState } from 'react';
import style from '../../../PurchaseOrderInstock/index.less';
import { CalendarOutline, RightOutline } from 'antd-mobile-icons';
import { Picker, Space } from 'antd-mobile';
import User from '../User';
import Number from '../../../../../../../../components/Number';
import StartEndDate from '../../../../../../../Production/CreateTask/components/StartEndDate';

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
        <StartEndDate
          split={<div>—</div>}
          value={[value.startTime, value.endTime]}
          startShow={value.startTime || <Space align='center'><CalendarOutline />起始</Space>}
          endShow={value.endTime || <Space align={'center'}><CalendarOutline />结束</Space>}
          onChange={(dates) => {
            onChange({ ...value, startTime: dates[0], endTime: dates[1] });
          }}
        />
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
