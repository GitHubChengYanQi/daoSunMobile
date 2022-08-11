import React from 'react';
import LinkButton from '../../../components/LinkButton';
import MyCard from '../../../components/MyCard';
import { Divider } from 'antd-mobile';
import style from './index.less';
import { MyDate } from '../../../components/MyDate';
import { RightOutline } from 'antd-mobile-icons';

const Order = () => {

  const orderType = [
    { title: '入库' },
    { title: '出库' },
    { title: '盘点' },
    { title: '调拨' },
    { title: '养护' },
  ];

  return <>
    {
      orderType.map((orderItem, orderIndex) => {
        return <MyCard
          key={orderIndex}
          className={style.orderItem}
          titleBom={<Divider className={style.divider} contentPosition='left'>{orderItem.title}</Divider>}
          extra={<LinkButton>更多</LinkButton>}
        >
          {
            [1, 2, 3].map((item, index) => {
              return <div key={index} className={style.orderInfo}>
                <div className={style.orderName}>xxx的{orderItem.title}单</div>
                <div className={style.time}>{MyDate.Show(new Date())} <RightOutline /></div>
              </div>;
            })
          }
        </MyCard>;
      })
    }
  </>;
};

export default Order;
