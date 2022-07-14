import React, { useRef, useState } from 'react';
import MyDatePicker from '../../../../../components/MyDatePicker';
import { CalendarOutline } from 'antd-mobile-icons';
import { MyDate } from '../../../../../components/MyDate';

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
      style={{ display: 'inline-block' }}
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
          <CalendarOutline />
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
      min={startDate || min}
      precision='minute'
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
