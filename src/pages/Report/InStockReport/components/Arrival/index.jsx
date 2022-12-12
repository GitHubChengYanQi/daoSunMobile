import React from 'react';
import styles from '../../index.less';
import { RightOutline } from 'antd-mobile-icons';

const Arrival = () => {


  return <>
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}> 到货量统计</div>
        <div>
          共 <span className='numberBlue'>108</span>家
          <RightOutline />
        </div>
      </div>
      <div className={styles.content}>
        <div>

        </div>
      </div>
    </div>
  </>;
};


export default Arrival;
