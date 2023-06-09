import moment from 'moment';
import { useEffect, useState } from 'react';
import Data from '../../Work/Allocation/SelectStoreHouse/components/Data';

const Show = (date) => {
  if (!date) {
    return '-';
  }

  return moment(date).format(moment(date).year() !== moment().year() ? 'YYYY年MM月DD日 HH:mm' : 'MM月DD日 HH:mm');
};

const formatDate = (date) => {
  const newDate = moment(date).format('YYYY/MM/DD HH:mm:ss');
  return new Date(newDate);
};


export const MyDate = {
  Show,
  formatDate,
};

// 时间倒计时
const secondsToMinutes = sec => {
  sec = Number(sec);
  let minutes = moment.duration(sec, 'seconds').minutes();
  let seconds = moment.duration(sec, 'seconds').seconds();
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  return minutes + ':' + seconds;
};

export const Clock = ({ className, seconds }) => {

  const [date, setDate] = useState(seconds);

  useEffect(() => {
    const tick = () => setDate(date - 1);
    const timerId = setTimeout(tick, 1000);
    if ((date - 1) < 0) {
      clearTimeout(timerId);
    }
    // 返回一个清除函数， 清除函数会在组件卸载前执行，执行当前effect前对上一个effect进行清除
    return () => clearTimeout(timerId);
  }, [date]);

  return <span className={className}>{secondsToMinutes(date)}</span>;
};
