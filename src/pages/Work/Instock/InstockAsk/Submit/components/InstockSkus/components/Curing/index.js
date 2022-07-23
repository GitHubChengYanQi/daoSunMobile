import React, { useState } from 'react';
import style from '../../../PurchaseOrderInstock/index.less';
import { CalendarOutline, RightOutline } from 'antd-mobile-icons';
import { Picker } from 'antd-mobile';
import User from '../User';
import StartEndDate, { getMinTime } from '../../../../../../../Production/CreateTask/components/StartEndDate';
import Title from '../../../../../../../../components/Title';
import MyCard from '../../../../../../../../components/MyCard';
import MyDatePicker from '../../../../../../../../components/MyDatePicker';
import { MyDate } from '../../../../../../../../components/MyDate';
import LinkButton from '../../../../../../../../components/LinkButton';
import MyAntPopup from '../../../../../../../../components/MyAntPopup';
import SkuItem from '../../../../../../../Sku/SkuItem';
import ShopNumber from '../../../../../coponents/SkuInstock/components/ShopNumber';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';

const Curing = (
  {
    skuView = [],
    skuTotal = 0,
    value = {},
    onChange = () => {
    },
    nearMaintenanceChange = () => {

    },
  },
) => {


  const [typeVisible, setTypeVisible] = useState();

  const [visible, setVisible] = useState();

  return <>
    <MyCard
      titleBom={<Title className={style.title}>养护临近</Title>}
      extra={<MyDatePicker
        min={getMinTime(new Date())}
        filter={{
          'minute': (number) => {
            return [0, 15, 30, 45].includes(number);
          },
        }}
        precision='minute'
        value={value.nearMaintenance}
        show={value.nearMaintenance ? MyDate.Show(value.nearMaintenance) : <CalendarOutline />}
        onChange={nearMaintenance => {
          nearMaintenanceChange(nearMaintenance);
          onChange({ ...value, nearMaintenance });
        }}
      />}
    />

    <MyCard title='任务预览' extra={<div className={style.info}>
      预计
      <span className='blue'>{skuView.length}</span> 类
      <span className='blue'>{skuTotal}</span>件物料
      <div hidden={skuView.length === 0} onClick={() => setVisible(true)}>查看 <RightOutline /></div>
    </div>} />

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
      titleBom={<Title className={style.title}>养护类型 <span>*</span></Title>}
      extra={<div onClick={() => {
        setTypeVisible(true);
      }}>
        {value.typeName || '请选择'}<RightOutline />
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

    <MyAntPopup title='任务预览' visible={visible} onClose={() => setVisible(false)}>
      <div style={{ maxHeight: '80vh', overflow: 'auto' }}>
        {
          skuView.map((item, index) => {
            return <div key={index} className={style.info} style={{ padding: 12 }}>
              <SkuItem
                className={style.skuInfo}
                skuResult={item.skuResult}
                extraWidth='90px'
                otherData={[
                  ToolUtil.isObject(item.brandResult).brandName || '无品牌',
                ]}
              />
              <ShopNumber show value={item.number} />
            </div>;
          })
        }
      </div>
    </MyAntPopup>

  </>;
};

export default Curing;
