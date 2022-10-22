import React from 'react';
import style from './index.less';
import { FloatingBubble } from 'antd-mobile';

const MyFloatingBubble = (
  {
    icon,
    children,
  },
) => {


  return <>
    <FloatingBubble
      axis='xy'
      magnetic='x'
      style={{
        '--initial-position-bottom': '84px',
        '--initial-position-right': '24px',
        '--edge-distance': '24px',
        '--size': '40px',
      }}
      className={style.float}
    >
      {icon || children}
    </FloatingBubble>
  </>;
};

export default MyFloatingBubble;
