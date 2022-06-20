import React, { useState } from 'react';
import style from '../../index.less';
import { Card } from 'antd-mobile';
import Number from '../../../../../../../components/Number';

const StockNumber = (
  {
    title,
    mixNum,
    maxNum,
    mixNumChange = () => {
    },
    maxNumChange = () => {
    },
  },
) => {

  const [minNumber, setMinNumber] = useState(mixNum);
  const [maxNumber, setMaxNumber] = useState(maxNum);

  return <div className={style.content}>
    <Card
      title={title}
      headerStyle={{ border: 'none' }}
    >
      <div className={style.stockNumber}>
        <Number
          value={minNumber}
          noBorder
          className={style.number}
          placeholder='最低库存'
          onChange={setMinNumber}
          onBlur={mixNumChange}
        />
        ~
        <Number
          value={maxNumber}
          noBorder
          className={style.number}
          placeholder='最高库存'
          onChange={setMaxNumber}
          onBlur={maxNumChange}
        />
      </div>
    </Card>
  </div>;
};

export default StockNumber;
