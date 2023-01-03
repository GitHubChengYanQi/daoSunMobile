import React, { useRef, useState } from 'react';
import MyDatePicker from '../MyDatePicker';
import { CalendarOutline } from 'antd-mobile-icons';
import { MyDate } from '../MyDate';
import LinkButton from '../LinkButton';
import { Space, Tabs } from 'antd-mobile';
import moment from 'moment';
import MyAntPopup from '../MyAntPopup';

export const getMinTime = (time) => {
  if (!time) {
    return undefined;
  }
  let minTime = new Date(time);
  if (!minTime) {
    return minTime;
  }
  if (minTime.getMinutes() >= 45) {
    minTime = MyDate.formatDate(minTime.setHours(minTime.getHours() + 1));
    minTime = MyDate.formatDate(minTime.setMinutes(0));
  }
  return minTime;
};

const StartEndDate = (
  {
    value = [],
    onChange = () => {
    },
    placeholder = '请选择时间',
    onClose = () => {
    },
    min,
    max,
    precision,
    className,
    textAlign,
    minWidth,
    render,
    dataRef,
    hidden,
  }) => {

  let clickRef = dataRef;
  if (!dataRef) {
    clickRef = useRef();
  }

  const [startDate, setStartDate] = useState();

  const [open, setOpen] = useState(false);

  return <>
    <div
      hidden={hidden}
      style={{ display: 'inline-block', minWidth: minWidth || 100, textAlign: textAlign || 'right' }}
      className={className}
      onClick={() => {
        setOpen(true);
      }}
    >
      {render || <Space align='center'>
        <LinkButton><CalendarOutline style={{ fontSize: 16 }} /></LinkButton>
        {value[0] && value[1] ? <div>{MyDate.Show(value[0])} - {MyDate.Show(value[1])}</div> : placeholder}
      </Space>}
    </div>
    <MyAntPopup
      visible={open}
      onLeft={() => setOpen(false)}
      leftText='取消'
      rightText='确定'
    >
      <Tabs>
        <Tabs.Tab title='起始时间' key='start'>
          <MyDatePicker
            isDatePickerView
            max={max}
            filter={{
              'minute': (number) => {
                return [0, 15, 30, 45].includes(number);
              },
            }}
            title={startDate ? '终止时间' : '起始时间'}
            value={value[0]}
            ref={clickRef}
            show
            min={precision === 'day' ? min : getMinTime(min)}
            precision={precision || 'minute'}
            onCancel={() => {
              setStartDate();
            }}
            afterClose={() => {
              onClose();
              if (startDate) {
                clickRef.current.open();
              }
            }}
            onChange={(date) => {
              setStartDate(date);
              onChange([date]);
            }} />
        </Tabs.Tab>
        <Tabs.Tab title='结束时间' key='end'>
          <MyDatePicker
            isDatePickerView
            max={max}
            filter={{
              'minute': (number) => {
                return [0, 15, 30, 45].includes(number);
              },
            }}
            title={startDate ? '终止时间' : '起始时间'}
            value={value[0]}
            ref={clickRef}
            show
            min={precision === 'day' ? startDate : getMinTime(MyDate.formatDate(MyDate.formatDate(startDate).setMinutes(MyDate.formatDate(startDate).getMinutes() + 1)))}
            precision={precision || 'minute'}
            onCancel={() => {
              setStartDate();
            }}
            afterClose={() => {
              onClose();
              if (startDate) {
                clickRef.current.open();
              }
            }}
            onChange={(date) => {
              const endDate = precision === 'day' ? moment(date).format('YYYY/MM/DD 23:59:59') : date;
              onChange([startDate, endDate]);
            }} />
        </Tabs.Tab>
      </Tabs>
    </MyAntPopup>
  </>;
};

export default StartEndDate;
