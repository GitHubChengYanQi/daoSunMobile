import React from 'react';
import { Space } from 'antd-mobile';
import MyDatePicker from '../../../../../components/MyDatePicker';

const StartEndDate = (
  {
    value = [],
    onChange = () => {
    },
    startShow,
    endShow,
    className,
    min,
  }) => {

  return <>
    <Space>
      <MyDatePicker
        className={className}
        show={startShow}
        title='开始时间'
        min={min}
        value={value[0]}
        precision='minute'
        onChange={(startDate) => {
          onChange([startDate]);
        }} />
      <MyDatePicker
        className={className}
        show={endShow}
        title='结束时间'
        min={value[0]}
        value={value[1]}
        precision='minute'
        onChange={(endDate) => {
          onChange([value[0], endDate]);
        }} />
    </Space>
  </>;
};

export default StartEndDate;
