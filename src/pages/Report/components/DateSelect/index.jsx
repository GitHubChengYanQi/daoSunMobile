import React, { useRef, useState } from 'react';
import { classNames } from '../../../components/ToolUtil';
import styles from '../../InStockReport/index.less';
import moment from 'moment';
import { RightOutline } from 'antd-mobile-icons';
import MyPicker from '../../../components/MyPicker';
import StartEndDate from '../../../Work/Production/CreateTask/components/StartEndDate';

export const getDate = (type) => {
  let newDate = [];
  switch (type) {
    case '全部':
      break;
    case '近7天':
      newDate = [moment().add(-6, 'd').format('YYYY/MM/DD 00:00:00'), moment().format('YYYY/MM/DD 23:59:59')];
      break;
    case '近15天':
      newDate = [moment().add(-14, 'd').format('YYYY/MM/DD 00:00:00'), moment().format('YYYY/MM/DD 23:59:59')];
      break;
    case '近三月':
      newDate = [moment().add(-3, 'M').format('YYYY/MM/DD 00:00:00'), moment().format('YYYY/MM/DD 23:59:59')];
      break;
    case '近半年':
      newDate = [moment().add(-6, 'M').format('YYYY/MM/DD 00:00:00'), moment().format('YYYY/MM/DD 23:59:59')];
      break;
    case '近一年':
      newDate = [moment().add(-1, 'y').format('YYYY/MM/DD 00:00:00'), moment().format('YYYY/MM/DD 23:59:59')];
      break;
    default:
      break;
  }
  return newDate;
};

const DateSelect = (
  {
    searchParams,
    setSearchParams,
  },
) => {

  const dataRef = useRef();

  const [visible, setVisible] = useState();

  return <>
    <div className={classNames(styles.card, styles.date)}>
      <div className={styles.dateLabel}>日期</div>
      <div className={styles.dateTime} onClick={() => setVisible(true)}>
        <div>
          {searchParams.timeType === 'diy' ? (moment(searchParams.time[0]).format('YYYY/MM/DD') + ' - ' + moment(searchParams.time[1]).format('YYYY/MM/DD')) : (searchParams.timeType || '请选择日期')}
        </div>
        <RightOutline />
      </div>
    </div>


    <MyPicker
      onClose={() => setVisible(false)}
      visible={visible}
      value={searchParams.timeType}
      options={[
        { label: '全部', value: '全部' },
        { label: '近7天', value: '近7天' },
        { label: '近15天', value: '近15天' },
        { label: '近三月', value: '近三月' },
        { label: '近半年', value: '近半年' },
        { label: '近一年', value: '近一年' },
        { label: '自定义', value: 'diy' },
      ]}
      onChange={(option) => {
        setVisible('');
        if (option.value === 'diy') {
          dataRef.current.open();
          return;
        }
        setSearchParams({ ...searchParams, time: getDate(option.value), timeType: option.value });
      }}
    />

    <StartEndDate
      hidden
      precision='day'
      minWidth='100%'
      value={searchParams.time}
      max={new Date()}
      onChange={(time) => {
        setSearchParams({
          ...searchParams,
          time: [moment(time[0]).format('YYYY/MM/DD 00:00:00'), moment(time[1]).format('YYYY/MM/DD 23:59:59')],
          timeType: 'diy',
        });
      }}
      dataRef={dataRef}
    />
  </>;
};

export default DateSelect;
