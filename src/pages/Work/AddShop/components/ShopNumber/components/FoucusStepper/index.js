import React, { useEffect } from 'react';
import { Stepper } from 'antd-mobile';

const FoucusStepper = (
  {
    value,
    onChange = () => {
    },
    onBlur = () => {
    },
    onFocus = () => {
    },
    min = 1,
    max,
    id,
  },
) => {

  useEffect(() => {
    const stepper = document.querySelector(`#${id} .adm-input-element`);
    if (stepper) {
      stepper.focus();
    }
  }, []);

  return <div id={id}>
    <Stepper
      max={max}
      min={min}
      onFocus={onFocus}
      onBlur={onBlur}
      style={{
        '--button-text-color': '#000',
      }}
      value={value}
      onChange={onChange}
    />
  </div>;
};

export default FoucusStepper;
