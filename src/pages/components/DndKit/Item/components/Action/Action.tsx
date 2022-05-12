// @ts-ignore
import React, { CSSProperties } from 'react';
import classNames from 'classnames';
// @ts-ignore
import styles from './Action.less';

export interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  active?: {
    fill: string;
    background: string;
  };
  cursor?: CSSProperties['cursor'];
  icon?: React.ReactNode;
  className;
  style;
}

export function Action({ active, className, cursor, style, ...props }: Props) {
  return (
    <div
      {...props}
      className={classNames(styles.Action, className)}
      tabIndex={0}
      style={
        {
          ...style,
          cursor,
          '--fill': active?.fill,
          '--background': active?.background,
        } as CSSProperties
      }
    />
  );
}
