import React from 'react';
import style from './index.less';
import { FloatingBubble } from 'antd-mobile';
import { classNames } from '../ToolUtil';

const MyFloatingBubble = (
  {
    icon,
    children,
    className,
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
      className={classNames(className,style.float)}
    >
      {icon || children}
    </FloatingBubble>
  </>;
};

export default MyFloatingBubble;
