import React from 'react';
import styles from './index.css';

const MyEllipsis = (
  {
    value,
    children,
    width,
    style,
    maxWidth,
    onClick = () => {
    },
  }) => {

  return <div
    className={styles.ellipsis}
    onClick={onClick}
    style={{
      maxWidth,
      width: width || '90%',
      ...style,
    }}>
    {value || children}
  </div>;
};

export default MyEllipsis;
