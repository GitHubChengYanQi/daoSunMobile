import React, { useState } from 'react';
import style from './index.less';
import { Button, Popup } from 'antd-mobile';
import { AddOutline, MinusOutline } from 'antd-mobile-icons';
import logo from '../../../assets/logo.png';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useBoolean } from 'ahooks';

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

  return <>
    <Popup
      visible={visible}
      afterShow={() => {
        setNumber(value);
      }}
      afterClose={() => {
        let newValue = number;
        if (number < min) {
          newValue = min;
        }
        if (number > max) {
          newValue = max;
        }
        onChange(newValue);
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
          {number}<span className={style.line}>|</span>
          </div>
          <Button onClick={() => {
            const newValue = number + 1;
            setNumber(newValue < max ? newValue : max);
          }}>
            <AddOutline />
          </Button>
        </div>
        <div
          className={style.keyboard}
          style={{
            backgroundImage: `url(${logo})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '50%',
            backgroundPosition: 'center',
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'clear'].map((item, index) => {
            switch (item) {
              case 'clear':
                return <div key={index} className={style.numberButton}>
                  <Button onClick={() => {
                    const numbers = `${number}`.split('');
                    const newValue = parseInt(numbers.filter((item, index) => {
                      return index !== numbers.length - 1;
                    }).join('') || 0);
                    setNumber(newValue);
                  }}><ArrowLeftOutlined /></Button>
                </div>;
              case '.':
                return <div key={index} className={style.numberButton}>
                  <Button disabled onClick={() => {

                  }}>.</Button>
                </div>;
              default:
                return <div key={index} className={style.numberButton}>
                  <Button onClick={() => {
                    const newValue = parseInt(`${number}` + item);
                    setNumber(newValue);
                  }}>{item}</Button>
                </div>;
            }
          })}
        </div>
      </div>

    </Popup>
  </>;
};

export default MyKeybord;
