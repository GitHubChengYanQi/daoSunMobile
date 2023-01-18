import React, { useState } from 'react';
import MyAudit from '../Work/ProcessTask/MyAudit';
import KeepAlive from '../../components/KeepAlive';
import MyNavBar from '../components/MyNavBar';

export const Notice = () => {
  const [scrollTop, setScrollTop] = useState(0);
  return <div
    id='content'
    style={{
      scrollMarginTop: scrollTop,
      height: '100%',
      overflow: 'auto',
    }}
    onScroll={(event) => {
      setScrollTop(event.target.scrollTop);
    }}
  >
    <MyNavBar title='任务' noDom />
    <MyAudit task />
  </div>;
};

export default Notice;
