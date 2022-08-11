import React from 'react';
import LinkButton from '../../../components/LinkButton';
import MyCard from '../../../components/MyCard';
import { Divider } from 'antd-mobile';
import style from './index.less';
import { MyDate } from '../../../components/MyDate';
import { RightOutline } from 'antd-mobile-icons';
import { useRequest } from '../../../../util/Request';
import { MyLoading } from '../../../components/MyLoading';
import MyEmpty from '../../../components/MyEmpty';
import { ToolUtil } from '../../../components/ToolUtil';
import { billPageList } from '../../OrderData';

export const OrderList = (
  {
    orderItem = {},
  },
) => {

  const { loading, data } = useRequest({
    ...billPageList,
    params: { limit: 3, page: 1 },
    data: { type: orderItem.type },
  });

  if (loading) {
    return <MyLoading />;
  }

  if (ToolUtil.isArray(data).length === 0) {
    return <></>;
  }

  return <MyCard
    className={style.orderItem}
    titleBom={<Divider className={style.divider} contentPosition='left'>{orderItem.title}</Divider>}
    extra={<LinkButton>更多</LinkButton>}
  >
    {
      ToolUtil.isArray(data).map((item, index) => {
        return <div key={index} className={style.orderInfo}>
          <div className={style.orderName}>{orderItem.title}记录单 /{item.coding}</div>
          <div className={style.time}>{MyDate.Show(item.createTime)} <RightOutline /></div>
        </div>;
      })
    }
  </MyCard>;
};

const Order = () => {

  const orderType = [
    { title: '入库', type: 'instockLog' },
    { title: '出库', type: 'outstockLog' },
    { title: '盘点', type: 'inventoryLog' },
    { title: '养护', type: 'maintenanceLog' },
    { title: '调拨', type: 'allocationLog' },
  ];

  return <>
    {
      orderType.map((orderItem, orderIndex) => {
        return <OrderList key={orderIndex} orderItem={orderItem} />;
      })
    }
  </>;
};

export default Order;
