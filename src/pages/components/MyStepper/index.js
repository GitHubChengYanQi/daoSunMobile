import React, { useState } from 'react';
import style from './index.less';
import { Button } from 'antd-mobile';
import { AddOutline, MinusOutline } from 'antd-mobile-icons';
import MyKeybord from '../MyKeybord';

const MyStepper = (
  {
    min = 0,
    max = 999999999,
    value = 0,
    onChange = () => {
    },
    open,
  },
) => {

  const [visible, setVisible] = useState(open);

  return <>
    <div className={style.stepper}>
      <Button disabled={value === min} onClick={() => {
        const newValue = value - 1;
        onChange(newValue > min ? newValue : min);
      }}>
        <MinusOutline />
      </Button>
      <div className={style.value} onClick={() => {
        setVisible(true);
      }}>
        {value}
      </div>
      <Button disabled={value === max} onClick={() => {
        const newValue = value + 1;
        onChange(newValue < max ? newValue : max);
      }}>
        <AddOutline />
      </Button>
    </div>

    <MyKeybord visible={visible} setVisible={setVisible} value={value} min={min} max={max} onChange={onChange} />
  </>;
};

export default MyStepper;
