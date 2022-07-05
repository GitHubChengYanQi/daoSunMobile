import React from 'react';
import style from './index.less';
import { ToolUtil } from '../ToolUtil';

const Title = ({ children, className, borderHeight = 12, fontSize = 14 }) => {

  return <span style={{ fontSize }} className={ToolUtil.classNames(style.title, className)}>
    <span className={style.leftBorder} style={{ height: borderHeight }} />
    {children}
  </span>;
};

export default Title;
