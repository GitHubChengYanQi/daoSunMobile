import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import style from './index.less';
import waitInstockShop from '../../../assets/waitInstockShop.png';
import { Badge } from 'antd-mobile';

const Bouncing = (
  {
    img,
    size = 100,
    number,
    color,
  },
  ref,
) => {

  const ballRef = useRef();

  const [num, setNum] = useState(0);

  useEffect(() => {
    setNum(number);
  }, [number]);

  const jump = (
    alter = () => {
    },
    number = 1,
  ) => {
    const ball = ballRef.current;
    ball.classList.add(style.jump);
    ball.onanimationend = () => {
      ball.classList.remove(style.jump);
      if (number !== null){
        setNum(num + number);
      }
      alter();
    };
  };

  useImperativeHandle(ref, () => ({
    jump,
  }));

  return <>
    <Badge
      color={color}
      content={num || null}
      style={{ '--right': '5%', '--top': '5%' }}>
      <div className={style.box} style={{ height: size, width: size }}>
        <div ref={ballRef} style={{ width: size, height: size }} className={style.ball}>
          <img src={img || waitInstockShop} alt='' width='100%' height='100%' />
        </div>
      </div>
    </Badge>
  </>;
};

export default React.forwardRef(Bouncing);
