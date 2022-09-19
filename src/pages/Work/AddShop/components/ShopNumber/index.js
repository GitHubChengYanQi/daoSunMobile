import React, { useState } from 'react';
import style from './index.less';
import MyKeybord from '../../../../components/MyKeybord';
import { ToolUtil } from '../../../../components/ToolUtil';

const ShopNumber = (
  {
    textAlign = 'center',
    value,
    onChange = () => {
    },
    show,
    min = 1,
    max = 999999999,
    className,
  },
) => {

  const [visible, setVisible] = useState();

  return <>
    <div style={{backgroundColor:!show && "#fff"}} className={ToolUtil.classNames(style.shopNumber)}>
      <div
        className={ToolUtil.classNames(style.number,className)}
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
    />
  </>;
};

export default ShopNumber;
