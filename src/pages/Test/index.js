import React, { useRef, useState } from 'react';
import { useSprings, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import clamp from 'lodash.clamp';
import SkuItem from '../Work/Sku/SkuItem';
import styles from './index.less';

export const Viewpager = (
  {
    skuItem,
    onAdd = () => {
    },
    onRemove = () => {
    },
    currentIndex,
  }) => {

  const pages = [
    'add',
    'sku',
    'remove',
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
    if (active && Math.abs(mx) > (width / 2)) {
      index.current = clamp(index.current + (xDir > 0 ? -1 : 1), 0, pages.length - 1);
      cancel();
    }
    api.start(i => {
      if (i < index.current - 1 || i > index.current + 1) {
        return { display: 'none' };
      }
      const x = (i - index.current) * width + (active ? mx : 0);
      const scale = active ? 1 - Math.abs(mx) / width / 2 : 1;
      if (scale === 1 && x === 0) {
        switch (pages[i]) {
          case 'add':
            onAdd(skuItem);
            break;
          case 'remove':
            onRemove(skuItem);
            break;
          default:
            break;
        }
      }
      return { x, scale, display: 'block' };
    });
  });


  return (
    <div className={styles.wrapper}>
      {props.map(({ x, display, scale }, i) => {
        return <animated.div className={styles.page} {...bind()} key={i} style={{ display, x }}>
          <animated.div style={{ scale }}>
            {pages[i] === 'sku' && <SkuItem key={index} skuResult={{ skuName: skuItem, spuResult: { name: '测试' } }} />}
          </animated.div>
        </animated.div>;
      })}
    </div>
  );
};


const Test = () => {

  const [items, setItems] = useState([0, 1, 2, 3, 4, 5]);

  const remove = (skuItem) => {
    setTimeout(()=>{
      setItems(items.filter(item => item !== skuItem));
    },500);
  };


  return <div style={{ padding: 16, backgroundColor: '#fff', height: '100vh' }}>
    {
      items.map((item, index) => {
        return <div key={index} style={{ margin: 8 }}>
          <Viewpager
            currentIndex={index}
            skuItem={item}
            onAdd={(skuItem) => {
              console.log('add');
              remove(skuItem);
            }}
            onRemove={(skuItem) => {
              console.log('remove');
              remove(skuItem);
            }}
          />
        </div>;
      })
    }
  </div>;
};

export default Test;
