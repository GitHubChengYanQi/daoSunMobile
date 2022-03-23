import React from 'react';
import { Space } from 'antd-mobile';
import MyDatePicker from '../../../../../components/MyDatePicker';

const StartEndDate = ({ value = [], onChange }) => {

  return <>
    <Space>
      <MyDatePicker title='开始时间' value={value[0]} precision='minute' onChange={(startDate) => {
        onChange([startDate]);
      }} />
      ——
      <MyDatePicker title='结束时间' min={value[0]} value={value[1]} precision='minute' onChange={(endDate) => {
        onChange([value[0], endDate]);
      }} />
    </Space>
  </>;
};

export default StartEndDate;
