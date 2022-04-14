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
      const hour = i < 10 ? {
        label: `${i}时`,
        value: `0${i}`,
      } : {
        label: `${i}时`,
        value: `${i}`,
      };
      hours.push(hour);
    }
    return hours;
  };

  const minute = () => {
    const minutes = [];
    for (let i = 0; i < 60; i++) {
      const minute = i < 10 ? {
        label: `${i}分`,
        value: `0${i}`,
      } : {
        label: `${i}分`,
        value: `${i}`,
      };
      minutes.push(minute);
    }
    return minutes;
  };

  const second = () => {
    const seconds = [];
    for (let i = 0; i < 60; i++) {
      const second = i < 10 ? {
        label: `${i}秒`,
        value: `0${i}`,
      } : {
        label: `${i}秒`,
        value: `${i}`,
      };
      seconds.push(second);
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
        onChange(`${value[0] || '00'}:${value[1] || '00'}:${value[2] || '00'}`);
      }}
    />
  </>;
};

export default MyTimePicker;
