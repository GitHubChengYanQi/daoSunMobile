import React from 'react';
import Summary from './components/Summary';
import NumberRanking from './components/NumberRanking';
import OutStockRanking from './components/OutStockRanking';
import Work from './components/Work';
import TaskStatistics from './components/TaskStatistics';
import Contrast from './components/Contrast';


const OutStockReport = () => {

  return <>
    <Summary />
    <NumberRanking />
    <div style={{ height: 8 }} />
    <OutStockRanking />
    <div style={{ height: 8 }} />
    <Work />
    <div style={{ height: 8 }} />
    <TaskStatistics />
    <Contrast />
    <div style={{ height: 24 }} />
  </>;
};

export default OutStockReport;
