import React, { useState } from 'react';
import { Selector } from 'antd-mobile';
import StartEndDate from '../../../../Work/Production/CreateTask/components/StartEndDate';
import styles from '../../index.less';
import { SelectorStyle } from '../../index';
import moment from 'moment';

export const getDate = (type) => {
  let newDate = [];
  return newDate;
};

const SearchTime = (
  {
    timeType,
    value = [],
    onChange = () => {
    },
  },
) => {

  const [diy, setDiy] = useState();

  return <>
    <Selector
      value={timeType}
      columns={4}
      style={SelectorStyle}
      showCheckMark={false}
      options={[
        { label: '近7天', value: '近7天' },
        { label: '近30天', value: '近30天' },
        { label: '近三月', value: '近三月' },
        { label: '近半年', value: '近半年' },
        { label: '近一年', value: '近一年' },
        { label: '至今', value: '至今' },
        { label: '自定义', value: 'diy' },
      ]}
      onChange={(v) => {
        if (v[0] === 'diy') {
          setDiy(true);
          onChange(undefined, v[0]);
          return;
        }
        setDiy(false);
        onChange(getDate(v[0]), v[0]);
      }}
    />

    <div hidden={!diy} className={styles.diyTime}>
      <StartEndDate
        render={<>{value[0] && value[1] ?
          <div>{moment(value[0]).format('YYYY/MM/DD')} - {moment(value[1]).format('YYYY/MM/DD')}</div> : '请选择时间'}</>}
        precision='day'
        minWidth='100%'
        max={new Date()}
        textAlign='left'
        value={value}
        onChange={(time) => onChange([moment(time[0]).format('YYYY/MM/DD 00:00:00'), moment(time[1]).format('YYYY/MM/DD 23:59:59')], 'diy')}
      />
    </div>
  </>;
};

export default SearchTime;
