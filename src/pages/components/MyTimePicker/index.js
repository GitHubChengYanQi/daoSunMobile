import React, { useState } from 'react';
import { Picker } from 'antd-mobile';
import LinkButton from '../LinkButton';

const MyTimePicker = (
  {
    value,
    onChange = () => {
    },
    width,
  },
) => {

  const [visible, setVisible] = useState(false);

  const hour = () => {
    const hours = [];
    for (let i = 1; i <= 24; i++) {
      hours.push({
        label: `${i}时`,
        value: `${i}`,
      });
    }
    return hours;
  };

  const minute = () => {
    const minutes = [];
    for (let i = 0; i < 60; i++) {
      minutes.push({
        label: `${i}分`,
        value: `${i}`,
      });
    }
    return minutes;
  };

  const second = () => {
    const seconds = [];
    for (let i = 0; i < 60; i++) {
      seconds.push({
        label: `${i}秒`,
        value: `${i}`,
      });
    }
    return seconds;
  };


  return <>
    <LinkButton
      style={{ color: '#000', width: width || '100%', textAlign: 'left' }}
      title={value && `${value.split(':')[0]}时${value.split(':')[1]}分${value.split(':')[2]}秒` || '选择时间'}
      onClick={() => {
        setVisible(true);
      }} />

    <Picker
      columns={[hour(), minute(), second()]}
      visible={visible}
      onClose={() => {
        setVisible(false);
      }}
      value={value ? value.split(':') : []}
      onConfirm={(value) => {
        onChange(`${value[0]}:${value[1]}:${value[2]}`);
      }}
    />
  </>;
};

export default MyTimePicker;
