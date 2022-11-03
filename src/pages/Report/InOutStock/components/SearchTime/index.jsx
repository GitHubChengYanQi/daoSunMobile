import React, { useState } from 'react';
import { Selector } from 'antd-mobile';
import StartEndDate from '../../../../Work/Production/CreateTask/components/StartEndDate';
import styles from '../../index.less';
import { SelectorStyle } from '../../index';
import moment from 'moment';

const SearchTime = (
  {
    timeType,
    value,
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
        { label: '近7天', value: '7day' },
        { label: '近30天', value: '30day' },
        { label: '近三月', value: '3month' },
        { label: '近半年', value: '0.5year' },
        { label: '近一年', value: '1year' },
        { label: '至今', value: 'now' },
        { label: '自定义', value: 'diy' },
      ]}
      onChange={(v) => {
        if (v[0] === 'diy') {
          setDiy(true);
          onChange(undefined,v[0]);
          return;
        }
        setDiy(false);
        let newDate = [];
        switch (v[0]) {
          case '7day':
            newDate = [moment().add(-7, 'd').format('YYYY/MM/DD 00:00:00'), moment().format('YYYY/MM/DD 23:59:59')];
            break;
          case '30day':
            newDate = [moment().add(-30, 'd').format('YYYY/MM/DD 00:00:00'), moment().format('YYYY/MM/DD 23:59:59')];
            break;
          case '3month':
            newDate = [moment().add(-3, 'M').format('YYYY/MM/DD 00:00:00'), moment().format('YYYY/MM/DD 23:59:59')];
            break;
          case '0.5year':
            newDate = [moment().add(-6, 'M').format('YYYY/MM/DD 00:00:00'), moment().format('YYYY/MM/DD 23:59:59')];
            break;
          case '1year':
            newDate = [moment().add(-1, 'y').format('YYYY/MM/DD 00:00:00'), moment().format('YYYY/MM/DD 23:59:59')];
            break;
          case 'now':
            break;
          default:
            break;
        }
        onChange(newDate,v[0]);
      }}
    />

    <div hidden={!diy} className={styles.diyTime}>
      <StartEndDate minWidth='100%' textAlign='left' value={value} onChange={(time)=>onChange(time,'diy')} />
    </div>
  </>;
};

export default SearchTime;
