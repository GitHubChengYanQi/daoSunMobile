import React, { useState } from 'react';
import styles from './index.less';
import { RightOutline } from 'antd-mobile-icons';
import Arrival from './components/Arrival';

const InStockReport = () => {

  const [searchParams, setSearchParams] = useState({});

  return <>
    <Arrival />
  </>;
};

export default InStockReport;
