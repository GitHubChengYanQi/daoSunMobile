import React, { useState } from 'react';
import MyAudit from '../Work/ProcessTask/MyAudit';
import KeepAlive from '../../components/KeepAlive';
import MyNavBar from '../components/MyNavBar';

export const NoticeList = () => {
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
    <MyAudit auditType='audit' top={0} />
  </div>;
};

const Notice = () => {
  return <KeepAlive id='task' contentId='content'>
    <MyNavBar title='任务' noDom />
    <NoticeList />
  </KeepAlive>;
};

export default Notice;
