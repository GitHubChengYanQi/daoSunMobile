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
    height,
    width,
    addAfter = () => {
    },
  },
  ref,
) => {

  const ballRef = useRef();

  const [num, setNum] = useState(0);

  useEffect(() => {
    if (typeof number === 'number') {
      setNum(number);
    }
  }, [number]);

  const jump = (
    after = () => {
    },
    number = 1,
  ) => {
    const ball = ballRef.current;
    ball.classList.add(style.jump);
    ball.onanimationend = () => {
      ball.classList.remove(style.jump);
      if (number !== null) {
        setNum(num + number);
      }
      after();
      addAfter();
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
      <div className={style.box} style={{ height: height || size, width: width || size }}>
        <div ref={ballRef} style={{ height: height || size, width: width || size }} className={style.ball}>
          <img src={img || waitInstockShop} alt='' width='100%' height='100%' />
        </div>
      </div>
    </Badge>
  </>;
};

export default React.forwardRef(Bouncing);
