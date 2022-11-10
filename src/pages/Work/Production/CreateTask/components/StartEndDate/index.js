import React, { useRef, useState } from 'react';
import MyDatePicker from '../../../../../components/MyDatePicker';
import { CalendarOutline } from 'antd-mobile-icons';
import { MyDate } from '../../../../../components/MyDate';
import LinkButton from '../../../../../components/LinkButton';
import { Space } from 'antd-mobile';

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
        {value[0] && value[1] ? <div>{MyDate.Show(value[0])} - {MyDate.Show(value[1])}</div> : '请选择时间'}
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
          onChange([startDate, date]);
          setStartDate();
        } else {
          setStartDate(date);
        }
      }} />
  </>;
};

export default StartEndDate;
