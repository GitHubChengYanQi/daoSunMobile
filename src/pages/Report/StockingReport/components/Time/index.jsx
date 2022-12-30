import React, { useRef, useState } from 'react';
import { RightOutline } from 'antd-mobile-icons';
import styles from './index.less';
import moment from 'moment/moment';
import StartEndDate from '../../../../components/StartEndDate';


const Time = ({onChange = () => {}}) => {
  const dataRef = useRef();

  const [timeType, setTimeType] = useState('month');

  const [diyTime, setDiyTime] = useState([]);

  const oneYear = moment(diyTime[1]).diff(diyTime[0], 'year') >= 1;

  return <>
    <div className={styles.timeBox} onClick={()=>{dataRef.current.open();}}>
      <div className={styles.timeBoxLeft}>日期</div>
      <div className={styles.timeBoxRight}>
        {moment(diyTime[0]).format(oneYear ? 'YY年MM月DD日' : 'MM月DD日') + '~' + moment(diyTime[1]).format(oneYear ? 'YY年MM月DD日' : 'MM月DD日')}
        <RightOutline /> </div>
    </div>

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

  </>
}

export default Time;
