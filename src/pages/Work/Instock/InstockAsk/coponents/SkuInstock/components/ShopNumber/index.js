import React, { useState } from 'react';
import style from './index.less';
import FoucusStepper from './components/FoucusStepper';

const ShopNumber = (
  {
    value,
    onChange = () => {
    },
    show,
    min = 1,
    max,
    id = 'stepper',
  },
) => {

  const [update, setUpdate] = useState();

  return <>
    <div className={style.shopNumber}>
      {update ?
        <FoucusStepper value={value} max={max} onChange={onChange} min={min} id={id} />
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
