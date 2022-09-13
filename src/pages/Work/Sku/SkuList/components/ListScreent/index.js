import React, { useState } from 'react';
import style from '../../index.less';
import { ToolUtil } from '../../../../../components/ToolUtil';
import Icon from '../../../../../components/Icon';

const ListScreent = (
  {
    screenRef,
    listRef,
    numberTitle,
    actions = [],
    sort = {},
    setSort = () => {
    },
    submit = () => {
    },
    sorts = [],
    onlySorts = [],
    screen,
    screenChange = () => {
    },
    screening,
    top,
    className,
  },
) => {

  const [finalSorts, setFinalSorts] = useState(sort.order);

  const sortAction = (field) => {
    let order = 'descend';
    if (sort.field === field) {
      switch (sort.order) {
        case 'ascend':
          if (onlySorts.includes(field)) {
            order = 'descend';
          } else {
            order = '';
          }
          break;
        case 'descend':
          order = 'ascend';
          break;
        default:
          order = 'descend';
          break;
      }
    }
    if (onlySorts.includes(field)) {
      setFinalSorts(order);
    }
    setSort({ field, order });
    submit({}, { field, order });
  };

  const sortShow = (field) => {

    if (sort.field !== field && !onlySorts.includes(field)) {
      return <Icon type='icon-paixu' />;
    }

    const order = sort.field !== field ? finalSorts : sort.order;

    switch (order) {
      case  'ascend' :
        return <Icon type='icon-paixubeifen' />;
      case  'descend' :
        return <Icon type='icon-paixubeifen2' />;
      default:
        return <Icon type='icon-paixu' />;
    }
  };

  return <div
    style={{ top }}
    className={ToolUtil.classNames(style.screen, className)}
    ref={screenRef}
  >
    <div className={style.stockNumber}>{numberTitle}</div>
    <div className={style.blank} />
    {actions}
    {
      sorts.map((item, index) => {
        return <div className={style.sort} key={index} onClick={() => {
          sortAction(item.field);
        }}>
          {item.title}
          {sortShow(item.field)}
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
  </div>;
};

export default ListScreent;
