import style from '../../index.less';
import { ToolUtil } from '../../../../../../util/ToolUtil';
import Icon from '../../../../../components/Icon';
import React from 'react';

const Screen = (
  {
    screenRef,
    listRef,
    numberTitle,
    actions = [],
    submit = () => {
    },
    sorts = [],
    screen,
    screenChange = () => {
    },
    screening,
    top,
  },
) => {

  const sortAction = (item) => {
    let order;
    switch (item.order) {
      case 'asc':
        order = 'desc';
        break;
      case 'desc':
        order = 'asc';
        break;
      default:
        order = 'desc';
        break;
    }
    submit({ field: item.field, order: order });
  };

  const sortShow = (order) => {

    switch (order) {
      case  'asc' :
        return <Icon type='icon-paixubeifen' />;
      case  'desc' :
        return <Icon type='icon-paixubeifen2' />;
      default:
        return <Icon type='icon-paixu' />;
    }
  };

  return <>
    <div
      style={{ top }}
      className={style.screen}
      ref={screenRef}
    >
      <div className={style.stockNumber}>{numberTitle}</div>
      <div className={style.blank} />
      {actions}
      {
        sorts.map((item, index) => {
          return <div className={style.sort} key={index} onClick={() => {
            sortAction(item);
          }}>
            {item.title}
            {sortShow(item.order)}
          </div>;
        })
      }
      <div
        className={ToolUtil.classNames(style.screenButton, screen && style.checked, screening && style.checking)}
        onClick={() => {
          if (screen) {
            listRef.current.removeAttribute('style');
            screenChange(false);
          } else {
            listRef.current.setAttribute('style', 'min-height:100vh');
            screenRef.current.scrollIntoView();
            screenChange(true);
          }
        }}
      >
        筛选 <Icon type='icon-shaixuan' />
        <div>
          <svg viewBox='0 0 30 30' className={style.leftCorner}>
            <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
              <path
                d='M30,0 C13.4314575,3.04359188e-15 -2.02906125e-15,13.4314575 0,30 L0,30 L0,0 Z'
                fill='var(--adm-color-white)'
                transform='translate(15.000000, 15.000000) scale(-1, -1) translate(-15.000000, -15.000000) ' />
            </g>
          </svg>
          <svg viewBox='0 0 30 30' className={style.rightCorner}>
            <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
              <path
                d='M30,0 C13.4314575,3.04359188e-15 -2.02906125e-15,13.4314575 0,30 L0,30 L0,0 Z'
                fill='var(--adm-color-white)'
                transform='translate(15.000000, 15.000000) scale(-1, -1) translate(-15.000000, -15.000000) ' />
            </g>
          </svg>
        </div>
      </div>
    </div>
  </>;
};

export default Screen;
