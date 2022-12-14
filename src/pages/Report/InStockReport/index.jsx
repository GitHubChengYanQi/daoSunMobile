import React from 'react';
import Arrival from './components/Arrival';
import ArrivalRanking from './components/ArrivalRanking';
import Summary from './components/Summary';
import NumberRanking from './components/NumberRanking';
import Work from './components/Work';
import TaskStatistics from './components/TaskStatistics';
import Contrast from './components/Contrast';

const InStockReport = () => {

  return <>
    <Arrival />
    <ArrivalRanking />
    <div style={{ height: 8 }} />
    <Summary />
    <NumberRanking />
    <div style={{ height: 8 }} />
    <Work />
    <div style={{ height: 8 }} />
    <TaskStatistics />
    <Contrast />
    <div style={{ height: 24 }} />
  </>;
};

export default InStockReport;
