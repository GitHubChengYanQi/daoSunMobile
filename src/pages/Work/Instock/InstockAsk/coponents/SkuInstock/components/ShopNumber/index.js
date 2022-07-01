import React, { useState } from 'react';
import style from './index.less';
import MyStepper from '../../../../../../../components/MyStepper';

const ShopNumber = (
  {
    value,
    onChange = () => {
    },
    onBlur = () => {
    },
    onFocus = () => {
    },
    show,
    min = 1,
    max = 999999999,
    id = 'stepper',
  },
) => {

  const [update, setUpdate] = useState();

  return <>
    <div className={style.shopNumber}>
      {update ?
        <MyStepper open onChange={onChange} value={value} min={min} max={max} />
        :
        <div className={style.number} style={{ border: show && 'none' }} onClick={() => {
          if (!show) {
            setUpdate(true);
          }
        }}>
          × {value}
        </div>}
    </div>
  </>;
};

export default ShopNumber;
