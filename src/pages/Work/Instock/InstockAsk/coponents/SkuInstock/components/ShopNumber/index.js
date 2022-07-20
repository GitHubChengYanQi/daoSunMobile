import React, { useState } from 'react';
import style from './index.less';
import MyKeybord from '../../../../../../../components/MyKeybord';

const ShopNumber = (
  {
    textAlign = 'center',
    value,
    onChange = () => {
    },
    show,
    min = 1,
    max = 999999999,
  },
) => {

  const [visible, setVisible] = useState();

  return <>
    <div className={style.shopNumber}>
      <div
        className={style.number}
        style={{ border: show && 'none', padding: show && 0, textAlign }}
        onClick={() => {
          if (!show) {
            setVisible(true);
          }
        }}>
        × {value}
      </div>
    </div>

    <MyKeybord
      visible={visible}
      setVisible={setVisible}
      value={value}
      min={min}
      max={max}
      onChange={onChange}
      // decimal={decimal}
    />
  </>;
};

export default ShopNumber;
