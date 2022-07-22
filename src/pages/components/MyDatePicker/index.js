import React, { useCallback, useImperativeHandle, useState } from 'react';
import { DatePicker } from 'antd-mobile';
import moment from 'moment';
import LinkButton from '../LinkButton';
import { MyDate } from '../MyDate';

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
    onClose = () => {
    },
    afterClose = () => {
    },
    afterShow = () => {
    },
    onCancel = () => {
    },
    show,
    filter,
    ...props
  }, ref) => {


  const now = new Date();

  const [visible, setVisible] = useState(false);

  const labelRenderer = useCallback((type, data) => {
    switch (type) {
      case 'year':
        return data + '年';
      case 'month':
        return data + '月';
      case 'day':
        return <div style={{ marginRight: 16 }}>{data + '日'}</div>;
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

  const open = () => {
    setVisible(true);
  };

  useImperativeHandle(ref, () => ({
    open,
  }));

  return (
    <div>
      <div onClick={() => {
        setVisible(true);
      }}>
        {show || <LinkButton
          style={{ color: '#000', width: width || '100%', textAlign: 'left', ...style }}
          title={<div>{value || (title || '选择日期')}</div>}
        />}
      </div>


      <DatePicker
        {...props}
        afterShow={afterShow}
        destroyOnClose
        precision={precision || 'day'}
        title={title || '时间选择'}
        value={value && MyDate.formatDate(value)}
        min={min && MyDate.formatDate(min)}
        max={max && MyDate.formatDate(max)}
        visible={visible}
        afterClose={afterClose}
        onClose={() => {
          onClose();
          setVisible(false);
        }}
        onCancel={onCancel}
        defaultValue={now}
        onConfirm={val => {
          switch (precision) {
            case 'year':
              onChange(moment(val).format('YYYY'));
              break;
            case 'month':
              onChange(moment(val).format('YYYY/MM'));
              break;
            case 'day':
              onChange(moment(val).format('YYYY/MM/DD'));
              break;
            case 'hour':
            case 'minute':
            case 'second':
              onChange(moment(val).format('YYYY/MM/DD HH:mm:ss'));
              break;
            default:
              onChange(moment(val).format('YYYY/MM/DD'));
              break;
          }
        }}
        renderLabel={labelRenderer}
        filter={filter}
      />
    </div>
  );
};

export default React.forwardRef(MyDatePicker);
