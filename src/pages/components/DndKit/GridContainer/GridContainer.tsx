// @ts-ignore
import React from 'react';

// @ts-ignore
import styles from './GridContainer.less';

export interface Props {
  children: React.ReactNode;
  columns: number;
}

export function GridContainer({children, columns}: Props) {
  return (
    <ul
      className={styles.GridContainer}
      style={
        {
          '--col-count': columns,
        } as React.CSSProperties
      }
    >
      {children}
    </ul>
  );
}
