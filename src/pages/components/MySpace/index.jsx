import React from 'react';
import styles from './index.less';

const MySpace = ({ children }) => {


  return <div className={styles.flexCenter}>{children}</div>;
};

export default MySpace;
