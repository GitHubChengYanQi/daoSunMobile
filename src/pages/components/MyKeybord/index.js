import React, { useEffect, useState } from 'react';
import style from './index.less';
import { Button, Popup } from 'antd-mobile';
import { AddOutline, MinusOutline } from 'antd-mobile-icons';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { ToolUtil } from '../ToolUtil';

const MyKeybord = (
  {
    noMask,
    popupClassName,
    noStepper,
    numberClick = () => {
    },
    visible,
    setVisible = () => {
    },
    value,
    onChange = () => {
    },
    min = 0,
    max = 999999999,
    decimal = 0,
    onConfirm = () => {
    },
    onBack = () => {
    },
  },
) => {

  const [number, setNumber] = useState(value || '');

  const [ok, setOk] = useState();

  let decimalLength;

  try {
    decimalLength = `${number}`.split('.')[1].length;
  } catch (e) {
    decimalLength = 0;
  }

  let step = '0.';
  if (decimalLength === 0) {
    step = 1;
  } else {
    for (let i = 0; i < decimalLength; i++) {
      if (i === decimalLength - 1) {
        step += 1;
      } else {
        step += 0;
      }
    }
  }

  const save = () => {
    const num = Number(number);
    let newValue = num;
    if (num < min) {
      newValue = min;
    }
    if (num > max) {
      newValue = max;
    }
    onChange(newValue);
  };

  useEffect(() => {
    if (visible) {
      setNumber(value || '');
    }
  }, [visible]);

  return <>
    <Popup
      visible={visible}
      afterShow={() => {
        setOk(false);
      }}
      afterClose={() => {
        if (!ok) {
          save();
        }
      }}
      className={ToolUtil.classNames(style.popup, popupClassName)}
      onMaskClick={() => {
        setVisible(false);
      }}>
      <div className={style.content}>
        <div hidden={noStepper} className={style.calculation}>
          <Button disabled={number === min} onClick={() => {
            const newValue = Number((Number(number) - Number(step)).toFixed(decimalLength));
            setNumber(newValue);
          }}>
            <MinusOutline />
          </Button>
          <div className={style.value}>
            {number || ''}<span className={style.line}>|</span>
          </div>
          <Button disabled={number === max} onClick={() => {
            const newValue = Number((Number(number) + Number(step)).toFixed(decimalLength));
            setNumber(newValue);
          }}>
            <AddOutline />
          </Button>
        </div>

        <div className={style.numberKeyboard}>
          <div
            className={style.keyboard}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '.'].map((item, index) => {
              switch (item) {
                case '.':
                  return <div key={index} className={style.numberButton}>
                    <Button disabled={!decimal} onClick={() => {
                      if (`${number}`.indexOf('.') === -1) {
                        setNumber((number || 0) + '.');
                      }
                    }}>.</Button>
                  </div>;
                default:
                  return <div
                    key={index}
                    className={ToolUtil.classNames(
                      style.numberButton,
                      item === 0 && style.zero,
                    )}
                  >
                    <Button onClick={() => {
                      if (number > 999999999) {
                        return;
                      }
                      numberClick(item);
                      if (!decimal || decimalLength < decimal) {
                        setNumber(`${number || ''}` + item);
                      }
                    }}>{item}</Button>
                  </div>;
              }
            })}
          </div>
          <div className={style.actions}>
            <div className={style.numberButton}>
              <Button onClick={() => {
                onBack();
                const numbers = `${number}`.split('');
                const newValue = numbers.filter((item, index) => {
                  return index !== numbers.length - 1;
                }).join('');
                setNumber(newValue);
              }}>
                <ArrowLeftOutlined />
              </Button>
            </div>
            <div className={ToolUtil.classNames(style.numberButton, style.ok)}>
              <Button onClick={() => {
                onConfirm();
                setVisible(false);
                save();
                setOk(true);
              }}>
                确定
              </Button>
            </div>
          </div>
        </div>

      </div>

    </Popup>
  </>;
};

export default MyKeybord;
