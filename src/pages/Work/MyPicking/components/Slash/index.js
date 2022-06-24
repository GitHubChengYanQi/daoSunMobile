import React from 'react';
import style from './index.less';

const Slash = (
  {
    leftText,
    rightText,
    rightStyle,
  },
) => {


  return <>
    <div className={style.box}>
      <div className={style.left}>{leftText}</div>
      <div className={style.slash} />
      <div className={style.right} style={rightStyle}>{rightText}</div>
    </div>
  </>;
};

export default Slash;
