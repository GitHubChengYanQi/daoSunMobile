import React, { useEffect, useState } from 'react';
import style from '../../index.less';
import MyDatePicker from '../../../../../../../components/MyDatePicker';
import { CalendarOutline, RightOutline } from 'antd-mobile-icons';
import { Button, Divider, Picker, Space } from 'antd-mobile';
import { MinusCircleFilled } from '@ant-design/icons';
import AllCondition from '../AllCondition';
import { ERPEnums } from '../../../../../../Stock/ERPEnums';
import StartEndDate from '../../../../../../Production/CreateTask/components/StartEndDate';
import MyCard from '../../../../../../../components/MyCard';

const Condition = (
  {
    type,
    noTime,
    value = {},
    onChange = () => {

    },
    paddingBottom,
  },
) => {

  const [addCondition, setAddCondition] = useState();

  const [conditionVisible, setConditionVisible] = useState({});

  const conditions = value.conditions || [];

  const conditionsDisabled = (value) => {
    return conditions.map(item => item.value).includes(value);
  };

  const [allConditions, setAllConditions] = useState([]);

  const [taskData, setTaskData] = useState({});

  const list = allConditions.filter(item => !conditionsDisabled(item.value));

  useEffect(() => {
    const initConditions = [
      { label: '材质', value: 'material' },
      { label: '品牌', value: 'brand' },
      { label: '库位', value: 'position' },
    ];
    switch (type) {
      case ERPEnums.stocktaking:
        initConditions.push({ label: '系统', value: 'sys', disabled: conditionsDisabled('sys') });
        break;
      case ERPEnums.maintenance:
        break;
      default:
        break;
    }
    setAllConditions(initConditions);
  }, []);

  const taskType = () => {
    switch (type) {
      case ERPEnums.stocktaking:
        return {
          dataItem: <>
            <div hidden={noTime} className={style.item}>
              <div className={style.title}>盘点时间 <span>*</span></div>
              <div>
                <StartEndDate
                  split={<div>—</div>}
                  value={[value.beginTime, value.endTime]}
                  startShow={value.beginTime || <Space align='center'><CalendarOutline />起始</Space>}
                  endShow={value.endTime || <Space align={'center'}><CalendarOutline />结束</Space>}
                  onChange={(dates) => {
                    onChange({ ...value, beginTime: dates[0], endTime: dates[1] });
                  }}
                />
              </div>
            </div>
          </>,
        };
      case ERPEnums.curing:
        return {
          dataItem: <>
            <div hidden={noTime} className={style.item}>
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
            <div hidden={noTime} className={style.item}>
              <div className={style.title}>养护类型 <span>*</span></div>
              <div onClick={() => {
                setTaskData({ typeVisible: true });
              }}>
                {value.typeName || '请选择'}<RightOutline />
              </div>
            </div>
          </>,
        };
      default:
        return {};
    }
  };

  return <>

    <div className={style.body} style={{ paddingBottom }}>
      {taskType().dataItem}

      {conditions.map((item, index) => {
        const data = item.data || {};
        return <div className={style.item} key={index}>
          <div className={style.title}><MinusCircleFilled onClick={() => {
            onChange({ ...value, conditions: conditions.filter(currentItem => currentItem.value !== item.value) });
          }} /> {item.label} <span>*</span></div>
          <div onClick={() => {
            setConditionVisible(item);
          }}>
            {data.title || '请选择'}<RightOutline />
          </div>
        </div>;
      })}


      <div className={style.addCondition}>
        <Divider className={style.divider}>
          <Button
            disabled={list.length === 0}
            color='primary'
            fill='outline'
            onClick={() => setAddCondition(true)}>添加条件</Button>
        </Divider>
      </div>
    </div>


    <Picker
      columns={[list]}
      visible={addCondition}
      onClose={() => setAddCondition(false)}
      onConfirm={(val, options) => {
        onChange({ ...value, conditions: [...conditions, options.items[0]] });
      }}
    />

    <Picker
      columns={[[{ label: '复检复调', value: 'check' }]]}
      visible={taskData.typeVisible}
      onClose={() => setTaskData({ ...taskData, typeVisible: false })}
      onConfirm={(val, options) => {
        const item = options.items[0] || {};
        onChange({ ...value, type: item.value, typeName: item.label });
      }}
    />

    <AllCondition value={conditionVisible.data} conditionVisible={conditionVisible.value} onChange={(data) => {
      const newConditions = conditions.map(item => {
        if (item.value === conditionVisible.value) {
          return { ...item, data };
        } else {
          return item;
        }
      });
      onChange({ ...value, conditions: newConditions });
      setConditionVisible({});
    }} onSuccess={() => setConditionVisible({})} />
  </>;
};

export default Condition;
