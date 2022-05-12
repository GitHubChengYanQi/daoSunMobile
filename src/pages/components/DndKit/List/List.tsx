// @ts-ignore
import React, {forwardRef} from 'react';
import classNames from 'classnames';

// @ts-ignore
import styles from './List.less';

export interface Props {
  children: React.ReactNode;
  columns?: number;
  style?: React.CSSProperties;
  horizontal?: boolean;
}

export const List = forwardRef<HTMLUListElement, Props>(
  ({children, columns = 1, horizontal, style}: Props, ref) => {
    return (
      <ul
        ref={ref}
        style={
          {
            padding: 0,
            ...style,
            '--columns': columns,
          } as React.CSSProperties
        }
        className={classNames(styles.List, horizontal && styles.horizontal)}
      >
        {children}
      </ul>
    );
  }
);
