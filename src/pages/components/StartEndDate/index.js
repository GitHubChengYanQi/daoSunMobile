import React, { useImperativeHandle, useRef, useState } from 'react';
import MyDatePicker from '../MyDatePicker';
import { CalendarOutline } from 'antd-mobile-icons';
import { MyDate } from '../MyDate';
import LinkButton from '../LinkButton';
import { Space, Tabs } from 'antd-mobile';
import moment from 'moment';
import MyAntPopup from '../MyAntPopup';

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
    getContainer,
    value = [],
    onChange = () => {
    },
    placeholder = '请选择时间',
    onClose = () => {
    },
    min,
    max,
    precision,
    className,
    textAlign,
    minWidth,
    render,
    hidden,
  }, ref) => {

  const [startDate, setStartDate] = useState();

  const [visible, setVisible] = useState(false);

  const [key, setKey] = useState('start');

  const [time, setTime] = useState(value || []);

  const open = () => {
    setKey('start');
    setTime(value || []);
    setVisible(true);
  };

  useImperativeHandle(ref, () => ({
    open,
  }));

  return <>
    <div
      hidden={hidden}
      style={{ display: 'inline-block', minWidth: minWidth || 100, textAlign: textAlign || 'right' }}
      className={className}
      onClick={() => {
        setKey('start');
        setTime(value || []);
        setVisible(true);
      }}
    >
      {render || <Space align='center'>
        <LinkButton><CalendarOutline style={{ fontSize: 16 }} /></LinkButton>
        {value[0] && value[1] ? <div>{MyDate.Show(value[0])} - {MyDate.Show(value[1])}</div> : placeholder}
      </Space>}
    </div>
    <MyAntPopup
      zIndex={1002}
      getContainer={getContainer}
      visible={visible}
      noTitle
      leftText={<LinkButton style={{ fontSize: 18 }} onClick={() => {
        onClose();
        setVisible(false);
      }}>取消</LinkButton>}
      rightText={<LinkButton
        style={{ fontSize: 18 }}
        onClick={() => {
          switch (time.length) {
            case 0:
              const startDate = moment().format(precision === 'day' ? 'YYYY/MM/DD 00:00:00' : 'YYYY/MM/DD HH:mm:ss');
              setStartDate(startDate);
              setTime([startDate]);
              setKey('end');
              break;
            case 1:
              if (key === 'end') {
                setVisible(false);
                const endDate = precision === 'day' ? moment(time[0]).format('YYYY/MM/DD 23:59:59') : getMinTime(MyDate.formatDate(MyDate.formatDate(time[0]).setMinutes(MyDate.formatDate(time[0]).getMinutes() + 1)));
                onChange([time[0], endDate]);
              } else {
                setKey('end');
              }
              break;
            case 2:
              if (key === 'start') {
                setKey('end');
                return;
              }
              setVisible(false);
              onChange(time);
              break;
          }
        }}
      >确定</LinkButton>}
    >
      <Tabs activeKey={key} onChange={setKey}>
        <Tabs.Tab title='起始时间' destroyOnClose key='start'>
          <MyDatePicker
            isDatePickerView
            max={max}
            filter={{
              'minute': (number) => {
                return [0, 15, 30, 45].includes(number);
              },
            }}
            title={startDate ? '终止时间' : '起始时间'}
            value={time[0]}
            show
            min={precision === 'day' ? min : getMinTime(min)}
            precision={precision || 'minute'}
            onChange={(date) => {
              setStartDate(date);
              setTime([date]);
            }} />
        </Tabs.Tab>
        <Tabs.Tab title='结束时间' destroyOnClose key='end'>
          <MyDatePicker
            isDatePickerView
            max={max}
            filter={{
              'minute': (number) => {
                return [0, 15, 30, 45].includes(number);
              },
            }}
            title={startDate ? '终止时间' : '起始时间'}
            value={time[1] || (precision === 'day' ? startDate : getMinTime(MyDate.formatDate(MyDate.formatDate(startDate).setMinutes(MyDate.formatDate(startDate).getMinutes() + 1))))}
            show
            min={precision === 'day' ? startDate : getMinTime(MyDate.formatDate(MyDate.formatDate(startDate).setMinutes(MyDate.formatDate(startDate).getMinutes() + 1)))}
            precision={precision || 'minute'}
            onChange={(date) => {
              const endDate = precision === 'day' ? moment(date).format('YYYY/MM/DD 23:59:59') : date;
              setTime([startDate, endDate]);
            }} />
        </Tabs.Tab>
      </Tabs>
    </MyAntPopup>
  </>;
};

export default React.forwardRef(StartEndDate);
