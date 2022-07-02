import React, { useEffect, useState } from 'react';
import style from './index.less';
import { Button, Popup } from 'antd-mobile';
import { AddOutline, MinusOutline } from 'antd-mobile-icons';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { ToolUtil } from '../ToolUtil';

const MyKeybord = (
  {
    visible,
    setVisible = () => {
    },
    value,
    onChange = () => {
    },
    min = 0,
    max = 999999999,
  },
) => {

  const [number, setNumber] = useState(value);

  const save = () => {
    let newValue = number;
    if (number < min) {
      newValue = min;
    }
    if (number > max) {
      newValue = max;
    }
    onChange(newValue);
  };

  useEffect(() => {
    if (visible){
      setNumber(value);
    }
  }, [visible]);

  return <>
    <Popup
      visible={visible}
      afterClose={() => {
        save();
      }}
      className={style.popup}
      onMaskClick={() => {
        setVisible(false);
      }}>
      <div className={style.content}>
        <div className={style.calculation}>
          <Button onClick={() => {
            const newValue = number - 1;
            setNumber(newValue > min ? newValue : min);
          }}>
            <MinusOutline />
          </Button>
          <div className={style.value}>
            {number || ''}<span className={style.line}>|</span>
          </div>
          <Button onClick={() => {
            const newValue = number + 1;
            setNumber(newValue < max ? newValue : max);
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
                    <Button disabled onClick={() => {

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
                      const newValue = parseInt(`${number}` + item);
                      setNumber(newValue);
                    }}>{item}</Button>
                  </div>;
              }
            })}
          </div>
          <div className={style.actions}>
            <div className={style.numberButton}>
              <Button onClick={() => {
                const numbers = `${number}`.split('');
                const newValue = parseInt(numbers.filter((item, index) => {
                  return index !== numbers.length - 1;
                }).join('') || 0);
                setNumber(newValue);
              }}><ArrowLeftOutlined />
              </Button>
            </div>
            <div className={ToolUtil.classNames(style.numberButton, style.ok)}>
              <Button onClick={() => {
                setVisible(false);
                save();
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
