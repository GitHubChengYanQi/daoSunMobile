import React from 'react';
import CountStatistics from './components/CountStatistics';
import CountTimes from './components/CountTimes';
import ErrorException from './components/ErrorException';
import ErrorSummary from './components/ErrorSummary';
import TaskStatistics from '../AllocationReport/components/TaskStatistics';
import ApplyRanking from './components/ApplyRanking';

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
