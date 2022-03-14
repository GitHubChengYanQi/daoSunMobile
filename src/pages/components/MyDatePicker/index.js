import React, { useCallback, useState } from 'react';
import { DatePicker } from 'antd-mobile';
import moment from 'moment';
import LinkButton from '../LinkButton';

const MyDatePicker = (
  {
    precision,
    value,
    width,
    onChange = () => {
    },
    ...props
  }) => {

  const now = new Date();

  const [visible, setVisible] = useState(false);

  const labelRenderer = useCallback((type, data) => {
    switch (type) {
      case 'year':
        return data + '年';
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
    <>
      <LinkButton
        style={{ color: '#000', width: width || '100%', textAlign: 'left' }}
        title={value || '选择日期'}
        onClick={() => {
          setVisible(true);
        }} />

      <DatePicker
        {...props}
        precision={precision || 'day'}
        title='时间选择'
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
              onChange(moment(val).format('YYYY-MM-DD h'));
              break;
            case 'minute':
              onChange(moment(val).format('YYYY-MM-DD h:mm'));
              break;
            case 'second':
              onChange(moment(val).format('YYYY-MM-DD h:mm:ss'));
              break;
            default:
              onChange(moment(val).format('YYYY-MM-DD'));
              break;
          }
        }}
        renderLabel={labelRenderer}
      />
    </>
  );
};

export default MyDatePicker;