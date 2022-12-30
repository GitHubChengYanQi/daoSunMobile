import React, { useState } from 'react';
import style from './index.less';
import MyKeybord from '../../../../components/MyKeybord';
import { ToolUtil } from '../../../../../util/ToolUtil';

const ShopNumber = (
  {
    textAlign = 'center',
    value = 0,
    onChange = () => {
    },
    show,
    min = 1,
    max = 999999999,
    className,
    number,
    placeholder,
    getContainer,
    decimal,
  },
) => {

  const [visible, setVisible] = useState();

  return <>
    <div style={{ backgroundColor: !show && '#fff' }} className={ToolUtil.classNames(style.shopNumber)}>
      <div
        className={ToolUtil.classNames(style.number, className)}
        style={{ border: show && 'none', padding: show && 0, textAlign }}
        onClick={() => {
          if (!show) {
            setVisible(true);
          }
        }}>
        {!number ? <>× {value}</> : (value || <span style={{color:'#cccccc'}}>{placeholder}</span>)}
      </div>
    </div>

    <MyKeybord
      decimal={decimal}
      getContainer={getContainer}
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
