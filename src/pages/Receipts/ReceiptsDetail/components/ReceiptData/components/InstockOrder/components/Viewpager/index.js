import React, { useRef } from 'react';
import styles from './index.less';
import { SwipeAction } from 'antd-mobile';

const Viewpager = (
  {
    onLeft = () => {
    },
    onRight = () => {
    },
    children,
  }) => {


  const actions = [{
    key: '1',
    text: '',
    color: '#fff',
  }];

  const ref = useRef();

  return <SwipeAction
    ref={ref}
    className={styles.swipeAction}
    leftActions={actions}
    rightActions={actions}
    onActionsReveal={(side) => {
      if (side === 'left') {
        onRight();
      } else {
        onLeft();
      }
      ref.current.close();
    }}
  >
    {children}
  </SwipeAction>;
};

export default Viewpager;
