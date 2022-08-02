import React, { useImperativeHandle, useRef } from 'react';
import style from './index.less';
import { Button } from 'antd-mobile';

const Bouncing = (
  {
    img,
    size = 100,
  },
  ref,
) => {

  const ballRef = useRef();

  const jump = () => {
    const ball = ballRef.current;
    ball.classList.add(style.jump);
    ball.onanimationend = () => {
      ball.classList.remove(style.jump);
    };
  };

  useImperativeHandle(ref, () => ({
    jump,
  }));

  return <>

    {/*<Button onClick={jump}>add</Button>*/}
    <div className={style.box} style={{ height: size * 1.5, width: size * 1.5 }}>
      <div ref={ballRef} style={{ width: size, height: size }} className={style.ball}>
        <img src={img} alt='' width='100%' height='100%' />
      </div>
    </div>
  </>;
};

export default React.forwardRef(Bouncing);
