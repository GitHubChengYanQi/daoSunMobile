import React, { useEffect, useState } from 'react';
import style from './index.less';
import FoucusStepper from './components/FoucusStepper';

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
    max = 99999,
    id = 'stepper',
  },
) => {

  const [update, setUpdate] = useState();

  useEffect(()=>{
    const input = document.querySelector(`#${id} input`);
    if (input){
      input.setAttribute('type','number')
    }
  },[update])

  return <>
    <div className={style.shopNumber}>
      {update ?
        <FoucusStepper value={value} max={max} onChange={(number)=>{
          onChange(number);
        }} min={min} id={id} onBlur={()=>{
          onBlur();
          // setUpdate(false);
        }} onFocus={onFocus} />
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
