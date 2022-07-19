import React from 'react';
import MyAudit from '../Work/ProcessTask/MyAudit';
import MyNavBar from '../components/MyNavBar';


const Notice = () => {

  return <>
    <MyNavBar title='任务列表' />
    <MyAudit auditType='audit' />
  </>;
};

export default Notice;
