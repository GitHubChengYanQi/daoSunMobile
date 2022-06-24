import React, { useState } from 'react';
import style from '../../index.less';
import { Card, Slider } from 'antd-mobile';

const StockNumber = (
  {
    title,
    numChange = () => {
    },
  },
) => {

  const [number, setNumber] = useState([0,1000]);

  return <div className={style.content}>
    <Card
      title={title}
      headerStyle={{ border: 'none' }}
    >
      <div className={style.showNumber}>
        {number[0]} - {number[1] === 1000 ? '不限' : number[1]}
      </div>
      <Slider
        step={100}
        max={1000}
        value={number}
        range
        onChange={value => {
          setNumber(value);
        }}
        onAfterChange={(value) => {
          numChange(value[0],value[1] === 1000 ? null : value[1]);
        }}
      />
    </Card>
  </div>;
};

export default StockNumber;
