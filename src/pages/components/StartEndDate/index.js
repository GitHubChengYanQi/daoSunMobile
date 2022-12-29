import React, { useRef, useState } from 'react';
import MyDatePicker from '../MyDatePicker';
import { CalendarOutline } from 'antd-mobile-icons';
import { MyDate } from '../MyDate';
import LinkButton from '../LinkButton';
import { Space } from 'antd-mobile';
import moment from 'moment';

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

  return <>
    <div
      hidden={hidden}
      style={{ display: 'inline-block', minWidth: minWidth || 100, textAlign: textAlign || 'right' }}
      className={className}
      onClick={() => {
        clickRef.current.open();
      }}
    >
      {render || <Space align='center'>
        <LinkButton><CalendarOutline style={{ fontSize: 16 }} /></LinkButton>
        {value[0] && value[1] ? <div>{MyDate.Show(value[0])} - {MyDate.Show(value[1])}</div> : placeholder}
      </Space>}
    </div>
    <MyDatePicker
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
      min={precision === 'day' ? (startDate || min) : getMinTime(startDate ? MyDate.formatDate(MyDate.formatDate(startDate).setMinutes(MyDate.formatDate(startDate).getMinutes() + 1)) : min)}
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
        if (startDate) {
          const endDate = precision === 'day' ? moment(date).format('YYYY/MM/DD 23:59:59') : date;
          onChange([startDate, endDate]);
          setStartDate();
        } else {
          setStartDate(date);
        }
      }} />
  </>;
};

export default StartEndDate;