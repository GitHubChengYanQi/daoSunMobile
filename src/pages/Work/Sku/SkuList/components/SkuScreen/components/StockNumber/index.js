import React, { useState } from 'react';
import style from '../../index.less';
import { Card, Selector, Slider } from 'antd-mobile';

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
      title={title}
      headerStyle={{ border: 'none' }}
    >
      <Selector
        columns={3}
        value={[step]}
        style={{
          '--border': 'solid transparent 1px',
          '--checked-border': 'solid var(--adm-color-primary) 1px',
          '--padding': '4px 15px',
        }}
        showCheckMark={false}
        options={[{ label: '步进10', value: 10 }, { label: '步进50', value: 50 }, { label: '步进100', value: 100 }]}
        onChange={(v) => {
          setStep(v[0]);
        }}
      />
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
