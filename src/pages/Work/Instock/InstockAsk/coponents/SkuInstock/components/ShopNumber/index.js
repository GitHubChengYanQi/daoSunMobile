import React, { useState } from 'react';
import style from './index.less';
import { Stepper } from 'antd-mobile';

const ShopNumber = (
  {
    value,
    onChange = () => {
    },
    show,
    min = 1,
    max,
  },
) => {

  const [update, setUpdate] = useState();

  return <>
    <div className={style.shopNumber}>
      {update ?
        <div>
          <Stepper
            max={max}
            min={min}
            style={{
              '--button-text-color': '#000',
            }}
            value={value}
            onChange={onChange}
          />
        </div>
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
