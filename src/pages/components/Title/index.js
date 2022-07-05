import React from 'react';
import style from './index.less';
import { ToolUtil } from '../ToolUtil';

const Title = ({ children, className }) => {

  return <span className={ToolUtil.classNames(style.title, className)}>{children}</span>;
};

export default Title;
