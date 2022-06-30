import React, { useState } from 'react';
import style from '../../index.less';
import { Button, Card, Divider, Slider } from 'antd-mobile';

const StockNumber = (
  {
    title,
    numChange = () => {
    },
  },
) => {

  const [number, setNumber] = useState([0, 1000]);

  const [step, setStep] = useState(10);

  return <div className={style.content}>
    <Card
      title={<Divider contentPosition='left' className={style.divider}>{title}</Divider>}
      headerStyle={{ border: 'none' }}
      extra={ <Button style={{backgroundColor:'#f5f5f5',fontSize:12}} color='default' onClick={() => {
        switch (step) {
          case 10:
            setStep(50);
            break;
          case 50:
            setStep(100);
            break;
          case 100:
            setStep(10);
            break;
          default:
            break;
        }
      }}>
        ×{step}
      </Button>}
    >
      <div className={style.showNumber}>
        {number[0]} - {number[1] === 1000 ? '不限' : number[1]}
      </div>
      <Slider
        step={step}
        max={1000}
        value={number}
        range
        onChange={value => {
          setNumber(value);
        }}
        onAfterChange={(value) => {
          numChange(value[0], value[1] === 1000 ? null : value[1]);
        }}
      />
    </Card>
  </div>;
};

export default StockNumber;
