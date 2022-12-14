import React, { useRef, useState } from 'react';
import styles from '../../index.less';
import { Button } from 'antd-mobile';
import moment from 'moment';
import StartEndDate from '../../../../Work/Production/CreateTask/components/StartEndDate';

const ScreenButtons = (
  {
    onChange = () => {
    },
    types = [
      { text: '今天', key: 'day' },
      { text: '本周', key: 'week' },
      { text: '本月', key: 'month' },
      // { text: '本年', key: 'year' },
    ],
  }) => {

  const dataRef = useRef();

  const [timeType, setTimeType] = useState('month');

  const [diyTime, setDiyTime] = useState([]);

  const oneYear = moment(diyTime[1]).diff(diyTime[0], 'year') >= 1;

  return <>
    <div className={styles.screen}>
      {
        types.map((item, index) => {
          return <Button
            key={index}
            className={index === 0 && styles.leftButton}
            color='primary'
            fill={timeType === item.key ? '' : 'outline'}
            onClick={() => {
              let value = [];
              switch (item.key) {
                case 'day':
                  value = [moment().format('YYYY/MM/DD 00:00:00'), moment().format('YYYY/MM/DD 23:59:59')];
                  break;
                case 'week':
                  value = [moment().weekday(1).format('YYYY/MM/DD 00:00:00'), moment().weekday(7).format('YYYY/MM/DD 23:59:59')];
                  break;
                case 'month':
                  value = [
                    moment().month(moment().month()).startOf('month').format('YYYY/MM/DD 00:00:00'),
                    moment().month(moment().month()).endOf('month').format('YYYY/MM/DD 23:59:59'),
                  ];
                  break;
                case 'year':
                  value = [
                    moment().year(moment().year()).startOf('year').format('YYYY/MM/DD 00:00:00'),
                    moment().year(moment().year()).endOf('year').format('YYYY/MM/DD 23:59:59'),
                  ];
                  break;
              }
              onChange(value);
              setTimeType(item.key);
            }}
          >
            {item.text}
          </Button>;
        })
      }
      <Button
        className={styles.rightButton}
        color='primary'
        fill={timeType === 'diy' ? '' : 'outline'}
        onClick={() => {
          dataRef.current.open();
        }}
      >
        自定义
      </Button>

      <span
        style={{ fontSize: 12, padding: '0 4px' }}
        hidden={timeType !== 'diy'}
        onClick={() => dataRef.current.open()}
      >
        {moment(diyTime[0]).format(oneYear ? 'YY年MM月DD日' : 'MM月DD日') + '~' + moment(diyTime[1]).format(oneYear ? 'YY年MM月DD日' : 'MM月DD日')}
      </span>

      <StartEndDate
        hidden
        precision='day'
        minWidth='100%'
        value={diyTime}
        max={new Date()}
        onChange={(time) => {
          setDiyTime(time);
          onChange([moment(time[0]).format('YYYY/MM/DD 00:00:00'), moment(time[1]).format('YYYY/MM/DD 23:59:59')]);
          setTimeType('diy');
        }}
        dataRef={dataRef}
      />

    </div>
  </>;
};

export default ScreenButtons;
