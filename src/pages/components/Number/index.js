import React, { useEffect, useState } from 'react';
import { Button, Input, NumberKeyboard } from 'antd-mobile';
import style from './index.css';

const Number = (
  {
    placeholder,
    buttonStyle,
    value,
    center,
    disabled,
    width,
    color,
    show,
    onChange = () => {
    },
  },
) => {

  const valueString = `${value ? value : value === 0 ? 0 : ''}`;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(show);
  }, [show]);

  const inputColor = () => {
    switch (color) {
      case 'red':
        return style.red;
      case 'blue':
        return style.blue;
      case 'black':
        return style.black;
      case 'eee':
        return style.eee;
      default:
        break;
    }
  };

  return <>
    <Button
      disabled={disabled}
      className={center && style.center}
      style={{ padding: 0, border: 'none', width: width || 200, ...buttonStyle }}
      onClick={() => setVisible(true)}>
      <Input className={inputColor()} placeholder={placeholder || '请输入'} value={valueString} readOnly />
    </Button>
    <NumberKeyboard
      closeOnConfirm
      confirmText='确定'
      visible={visible}
      onClose={() => {
        setVisible(false);
      }}
      onInput={(string) => {
        onChange(parseInt(valueString + string));
      }}
      onDelete={() => {
        if (valueString.length === 1) {
          return onChange(0);
        }
        onChange(parseInt(valueString.slice(0, valueString.length - 1)));
      }}
      safeArea
    />
  </>;
};

export default Number;
