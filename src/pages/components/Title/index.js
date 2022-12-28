import React from 'react';
import style from './index.less';
import { ToolUtil } from '../../../util/ToolUtil';

const Title = ({ children, className}) => {

  return <span className={ToolUtil.classNames(style.title, className)}>
    <span className={style.leftBorder} />
    {children}
  </span>;
};

export default Title;
