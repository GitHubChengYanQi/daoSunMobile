import React, { useState } from 'react';
import { Input } from 'antd-mobile';
import style from './index.css';
import { ToolUtil } from '../../../util/ToolUtil';

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
    className,
    onBlur = () => {
    },
    ...props
  },
) => {

  const [number, setNumber] = useState();

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

  return <div className={ToolUtil.classNames(
    center && style.center,
    className,
  )}>
    <Input
      {...props}
      min={0}
      value={value || ''}
      type='number'
      disabled={disabled}
      className={ToolUtil.classNames(style.input, inputColor(), inputRight ? style.inputRight : '')}
      placeholder={placeholder || '请输入'}
      style={{
        borderBottom: !noBorder && 'solid 1px rgb(190 184 184)',
        width: width || '100%', ...buttonStyle,
      }}
      onChange={(string) => {
        if (string === '') {
          onChange(string);
          setNumber(string);
        } else if (!isNaN(parseInt(string))) {
          onChange(parseInt(string));
          setNumber(parseInt(string));
        }
      }}
      onBlur={() => {
        onBlur(number);
      }}
    />
  </div>;
};

export default Number;
