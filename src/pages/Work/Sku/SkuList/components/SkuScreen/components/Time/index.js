import React, { useEffect, useState } from 'react';
import style from '../../index.less';
import { Card, Selector } from 'antd-mobile';
import StartEndDate from '../../../../../../Production/CreateTask/components/StartEndDate';
import { ClockCircleOutline } from 'antd-mobile-icons';
import moment from 'moment';

const Time = (
  {
    value,
    title,
    onChange = () => {
    },
  }) => {

  const [startDate, setShartDate] = useState();
  const [endDate, setEndtDate] = useState();

  const [key, setKey] = useState([]);

  const dateChange = (startDate, endDate) => {
    const startTime = startDate ? moment(startDate).format('YYYY/MM/DD HH:mm:ss') : null;
    const endTime = endDate ? moment(endDate).format('YYYY/MM/DD HH:mm:ss') : null;
    setShartDate(startTime);
    setEndtDate(endTime);
    onChange({ startTime, endTime });
  };

  useEffect(() => {
    if (!value) {
      setShartDate(undefined);
      setEndtDate(undefined);
      setKey([]);
    }
  }, [value]);

  return <>
    <Card
      title={title}
      headerStyle={{ border: 'none' }}
    >
      <Selector
        columns={3}
        value={key}
        style={{
          '--border': 'solid transparent 1px',
          '--checked-border': 'solid var(--adm-color-primary) 1px',
          '--padding': '4px 15px',
        }}
        showCheckMark={false}
        options={[{ label: '3天内', value: 3 }, { label: '7天内', value: 7 }, { label: '本月内', value: 30 }]}
        onChange={(v) => {
          const nowDate = new Date();
          const startDate = new Date();
          switch (v[0]) {
            case 3:
              startDate.setDate(nowDate.getDate() - 3);
              dateChange(startDate, nowDate);
              break;
            case 7:
              startDate.setDate(nowDate.getDate() - 7);
              dateChange(startDate, nowDate);
              break;
            case 30:
              startDate.setDate(1);
              dateChange(startDate, nowDate);
              break;
            default:
              break;
          }
          setKey(v);
        }}
      />

      <div className={style.time}>
        <StartEndDate
          value={[startDate, endDate]}
          startShow={
            <div className={style.timeShow}>
              <ClockCircleOutline />
              <span>{startDate ? startDate.split(' ')[0] : '起始时间'}</span>
            </div>
          }
          endShow={
            <div className={style.timeShow}>
              <ClockCircleOutline />
              <span>{endDate ? endDate.split(' ')[0] : '截止时间'}</span>
            </div>
          }
          onChange={(dates) => {
            dateChange(dates[0], dates[1]);
          }}
        />
      </div>


    </Card>


  </>;
};

export default Time;
