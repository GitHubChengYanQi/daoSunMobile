import React, { useState } from 'react';
import { Button, Popup, Stepper } from 'antd-mobile';
import style from './index.less';

const Test = () => {

  const [visible, setVisible] = useState();

  const [value, onChange] = useState(0);

  return <>
    <Stepper
      onFocus={() => {
        setVisible(true);
      }}
      onBlur={() => setVisible(false)}
      style={{
        '--button-text-color': '#000',
      }}
      value={value}
      onChange={onChange}
    />

    <div className={style.keyboard}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'no', 0, 'clear'].map((item, index) => {
        switch (item) {
          case 'clear':
            return <div key={index} className={style.numberButton}>
              <Button onClick={()=>{
                const numbers = `${value}`.split('');
                onChange()
              }}>{item}</Button>
            </div>;
          case 'no':
            return <div key={index} className={style.numberButton}>

            </div>;
          default:
            return <div key={index} className={style.numberButton}>
              <Button onClick={() => {
                onChange(parseInt(`${value}` + item));
              }}>{item}</Button>
            </div>;
        }
      })}
    </div>

    <Popup visible={visible}>

    </Popup>
  </>;
};

export default Test;
