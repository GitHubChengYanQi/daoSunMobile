import React from 'react';
import CountStatistics from '@/pages/Report/Stocking/components/CountStatistics';
import ErrorException from '@/pages/Report/Stocking/components/ErrorException';
import CountTimes from '@/pages/Report/Stocking/components/CountTimes';
import ErrorSummary from '@/pages/Report/Stocking/components/ErrorSummary';
import TaskStatistics from '@/pages/Report/Stocking/components/TaskStatistics';
import ApplyRanking from '@/pages/Report/Stocking/components/ApplyRanking';

const Stocking = () => {
  return <>
    <CountStatistics />
    <CountTimes/>
    <div style={{ height: 8 }} />
    <ErrorException/>
    <div style={{ height: 8 }} />
    <ErrorSummary/>
    <div style={{ height: 8 }} />
    <TaskStatistics />
    <ApplyRanking/>
  </>
}

export default Stocking;
