import React, { useRef, useState } from 'react';
import MyDatePicker from '../../../../../components/MyDatePicker';
import { CalendarOutline } from 'antd-mobile-icons';
import { MyDate } from '../../../../../components/MyDate';

export const getMinTime = (minTime) => {
  if (minTime.getMinutes() >= 45) {
    minTime = MyDate.formatDate(minTime.setHours(minTime.getHours() + 1))
    minTime = MyDate.formatDate(minTime.setMinutes(0));
  }
  return minTime;
};

const StartEndDate = (
  {
    value = [],
    onChange = () => {
    },
    min,
    className,
  }) => {


  const ref = useRef();

  const [startDate, setStartDate] = useState();

  return <>
    <div
      style={{ display: 'inline-block',width:100,textAlign:'right' }}
      className={className}
      onClick={() => {
        ref.current.open();
      }}
    >
      {
        value[0] && value[1] ?
          <>
            {MyDate.Show(value[0])} - {MyDate.Show(value[1])}
          </>
          :
          <CalendarOutline style={{fontSize:16}} />
      }
    </div>
    <MyDatePicker
      filter={{
        'minute': (number) => {
          return [0, 15, 30, 45].includes(number);
        },
      }}
      title={startDate ? '终止时间' : '起始时间'}
      value={value[0]}
      ref={ref}
      show
      min={getMinTime(startDate ? MyDate.formatDate(MyDate.formatDate(startDate).setMinutes(MyDate.formatDate(startDate).getMinutes() + 1)) : min)}
      precision='minute'
      onCancel={() => {
        setStartDate();
      }}
      afterClose={() => {
        if (startDate) {
          ref.current.open();
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
