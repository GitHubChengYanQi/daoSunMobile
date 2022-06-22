import React, { useRef } from 'react';
import { animated, useSprings } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import clamp from 'lodash.clamp';
import styles from './index.less';

const Viewpager = (
  {
    onLeft = () => {
    },
    onRight = () => {
    },
    children,
    currentIndex,
    onClick = () => {
    },
  }) => {

  const pages = [
    'left',
    'content',
    'right',
  ];

  const index = useRef(1);
  const width = window.innerWidth;


  const [props, api] = useSprings(pages.length, i => ({
    x: (i * width) - width,
    scale: 1,
    display: 'block',
  }));

  if (index.current !== 1) {
    index.current = 1;
    api.start(i => {
      return {
        x: (i * width) - width,
        scale: 1,
        display: 'block',
      };
    });
  }

  const bind = useDrag(({ active, movement: [mx], direction: [xDir], cancel }) => {
    if (active && Math.abs(mx) > (width / 4)) {
      index.current = clamp(index.current + (xDir > 0 ? -1 : 1), 0, pages.length - 1);
      cancel();
    }
    api.start(i => {
      if (i < index.current - 1 || i > index.current + 1) {
        return { display: 'none' };
      }
      const x = (i - index.current) * width + (active ? mx : 0);
      const scale = active ? 1 - Math.abs(mx) / width / 2 : 1;
      if (scale === 1 && x === 0 && index.current !== 1) {
        setTimeout(() => {
          switch (pages[i]) {
            case 'left':
              onRight();
              break;
            case 'right':
              onLeft();
              break;
            default:
              break;
          }
        }, 500);
      }
      return { x, scale, display: 'block' };
    });
  }) || '';


  return (
    <div className={styles.wrapper} onClick={onClick}>
      {props.map(({ x, display, scale }, i) => {
        return <animated.div
          className={styles.page}
          {...bind()}
          key={i}
          style={{ display, x }}
        >
          <animated.div style={{ scale }}>
            {pages[i] === 'content' && children}
          </animated.div>
        </animated.div>;
      })}
    </div>
  );
};

export default Viewpager;
