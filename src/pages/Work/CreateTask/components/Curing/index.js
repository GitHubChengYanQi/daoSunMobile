import React, { useState } from 'react';
import style from '../../../Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import { CalendarOutline, RightOutline } from 'antd-mobile-icons';
import User from '../User';
import Title from '../../../../components/Title';
import MyCard from '../../../../components/MyCard';
import MyDatePicker from '../../../../components/MyDatePicker';
import { MyDate } from '../../../../components/MyDate';
import MyAntPopup from '../../../../components/MyAntPopup';
import SkuItem from '../../../Sku/SkuItem';
import ShopNumber from '../../../AddShop/components/ShopNumber';
import { ToolUtil } from '../../../../../util/ToolUtil';
import MyPicker from '../../../../components/MyPicker';
import StartEndDate, { getMinTime } from '../../../../components/StartEndDate';

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

  const typeFormat = (type) => {
    switch (type) {
      case 'check':
        return '复检复调';
      case 'time':
        return '周期养护';
      case 'current':
        return '指定养护';
      default:
        return '请选择';
    }
  };


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

    <MyCard titleBom={<Title className={style.title}>养护类型 <span>*</span></Title>} extra={<div onClick={() => {
      setTypeVisible(true);
    }}>
      {typeFormat(value.type)}
    </div>} />

    <MyPicker
      onClose={() => setTypeVisible(false)}
      visible={typeVisible}
      value={value.type}
      onChange={(option) => {
        setTypeVisible(false);
        onChange({ ...value, type: option.value });
      }}
      options={[
        { label: '复检复调', value: 'check' },
        { label: '周期养护', value: 'time' },
        { label: '指定养护', value: 'current' },
      ]}
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
