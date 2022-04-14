import React, { useCallback, useState } from 'react';
import { DatePicker } from 'antd-mobile';
import moment from 'moment';
import LinkButton from '../LinkButton';
import styles from './index.css';

const MyDatePicker = (
  {
    precision,
    value,
    width,
    title,
    min,
    max,
    style,
    onChange = () => {
    },
    ...props
  }) => {


  const now = new Date();

  const [visible, setVisible] = useState(false);

  const labelRenderer = useCallback((type, data) => {
    switch (type) {
      case 'year':
        return data;
      case 'month':
        return data + '月';
      case 'day':
        return data + '日';
      case 'hour':
        return data + '时';
      case 'minute':
        return data + '分';
      case 'second':
        return data + '秒';
      default:
        return data;
    }
  }, []);


  return (
    <div>
      <LinkButton
        style={{ color: '#000', width: width || '100%', textAlign: 'left',...style }}
        title={value || (title || '选择日期')}
        onClick={() => {
          setVisible(true);
        }} />

      <DatePicker
        {...props}
        precision={precision || 'day'}
        title='时间选择'
        value={value && new Date(value)}
        min={min && new Date(min)}
        max={max && new Date(max)}
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        defaultValue={now}
        onConfirm={val => {
          switch (precision) {
            case 'year':
              onChange(moment(val).format('YYYY'));
              break;
            case 'month':
              onChange(moment(val).format('YYYY-MM'));
              break;
            case 'day':
              onChange(moment(val).format('YYYY-MM-DD'));
              break;
            case 'hour':
            case 'minute':
            case 'second':
              onChange(moment(val).format('YYYY-MM-DD hh:mm:ss'));
              break;
            default:
              onChange(moment(val).format('YYYY-MM-DD'));
              break;
          }
        }}
        renderLabel={labelRenderer}
      />
    </div>
  );
};

export default MyDatePicker;
