import React from 'react';
import styles from './index.css'

const MyEllipsis = (
  {
    value,
    children,
    width,
    style,
  }) => {

  return <div
    className={styles.ellipsis}
    style={{
    width: width || '90%',
    ...style
  }}>
    {value || children}
  </div>;
};

export default MyEllipsis;
