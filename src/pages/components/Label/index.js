import React from 'react';
import { ToolUtil } from '../ToolUtil';
import style from './index.less'

const Label = ({children,className}) => {

  return <span className={ToolUtil.classNames(className,style.label)}>{children}</span>;
};

export default Label;
