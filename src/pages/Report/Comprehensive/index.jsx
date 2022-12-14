import React from 'react';
import StockStatistics from './components/StockStatistics';
import NumberRanking from './components/NumberRanking';
import CycleStatistics from './components/CycleStatistics';
import LackRanking from './components/LackRanking';
import TaskStatistics from './components/TaskStatistics';
import Work from './components/Work';
import Ranking from './components/Ranking';

const Comprehensive = () => {


  return <>
    <StockStatistics />
    <NumberRanking />
    <div style={{ height: 8 }} />
    <CycleStatistics />
    <div style={{ height: 8 }} />
    <LackRanking />
    <div style={{ height: 8 }} />
    <TaskStatistics />
    <div style={{ height: 8 }} />
    <Work />
    <div style={{ height: 8 }} />
    <Ranking />
    <div style={{ height: 24 }} />
  </>;
};

export default Comprehensive;
