import React, { useImperativeHandle, useRef } from 'react';
import style from './index.less';
import waitInstockShop from '../../../assets/waitInstockShop.png';

const Bouncing = (
  {
    img,
    size = 100,
  },
  ref,
) => {

  const ballRef = useRef();

  const jump = (
    alter = () => {
    },
  ) => {
    const ball = ballRef.current;
    ball.classList.add(style.jump);
    ball.onanimationend = () => {
      ball.classList.remove(style.jump);
      alter();
    };
  };

  useImperativeHandle(ref, () => ({
    jump,
  }));

  return <>
    <div className={style.box} style={{ height: size, width: size }}>
      <div ref={ballRef} style={{ width: size, height: size }} className={style.ball}>
        <img src={img || waitInstockShop} alt='' width='100%' height='100%' />
      </div>
    </div>
  </>;
};

export default React.forwardRef(Bouncing);
