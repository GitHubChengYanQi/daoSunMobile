import React from 'react';
import styles from './index.css';

const MyEllipsis = (
  {
    value,
    children,
    width,
    style,
    maxWidth,
  }) => {

  return <div
    className={styles.ellipsis}
    style={{
      maxWidth,
      width: width || '90%',
      ...style,
    }}>
    {value || children}
  </div>;
};

export default MyEllipsis;
