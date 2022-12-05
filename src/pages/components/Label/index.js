import React from 'react';
import { ToolUtil } from '../ToolUtil';
import styles from './index.less';

const Label = ({ children, className,style }) => {

  return <span style={style} className={ToolUtil.classNames(className, styles.label)}>{children}</span>;
};

export default Label;
