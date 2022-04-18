import React from 'react';
import { Input } from 'antd-mobile';
import style from './index.css';

const Number = (
  {
    placeholder,
    buttonStyle,
    center,
    disabled,
    width,
    value,
    color,
    noBorder,
    inputRight,
    onChange = () => {
    },
    ...props
  },
) => {

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

  return <div className={center && style.center}>
    <Input
      {...props}
      min={0}
      value={value || ''}
      type='number'
      disabled={disabled}
      className={`${inputColor()} ${inputRight && style.inputRight}`}
      placeholder={placeholder || '请输入'}
      style={{
        padding: '4px 8px',
        border: 'none',
        '--border-radius': 0,
        borderBottom: !noBorder && 'solid 1px rgb(190 184 184)',
        width: width || '100%', ...buttonStyle,
      }}
      onChange={(string) => {
        if (string === '') {
          onChange(string);
        } else if (!isNaN(parseInt(string))) {
          onChange(parseInt(string));
        }
      }}
    />
  </div>;
};

export default Number;
