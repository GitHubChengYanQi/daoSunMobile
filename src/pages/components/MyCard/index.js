import React from 'react';
import Title from '../Title';
import style from './index.less';
import { ToolUtil } from '../ToolUtil';

const MyCard = (
  {
    title,
    titleBom,
    extra,
    children,
    bodyClassName,
    headerClassName,
    className,
    noHeader,
    hidden,
  },
) => {


  return <div hidden={hidden} className={ToolUtil.classNames(className, style.card)}>
    <div hidden={noHeader} className={ToolUtil.classNames(headerClassName, style.header)}>
      <div className={style.title}>{titleBom || <Title>{title}</Title>}</div>
      <div className={style.extra}>
        {extra}
      </div>
    </div>
    <div hidden={!children} className={ToolUtil.classNames(bodyClassName, style.content)}>
      {children}
    </div>
  </div>;
};


export default MyCard;
