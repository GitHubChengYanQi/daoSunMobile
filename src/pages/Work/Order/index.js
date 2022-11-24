import React, { useEffect, useRef, useState } from 'react';
import MyList from '../../components/MyList';
import { Card, Space } from 'antd-mobile';
import { history, useLocation } from 'umi';
import { orderList } from './Url';
import MyNavBar from '../../components/MyNavBar';
import Label from '../../components/Label';
import styles from '../Production/index.less';
import MyEmpty from '../../components/MyEmpty';
import MyCard from '../../components/MyCard';
import { MyDate } from '../../components/MyDate';

const Order = () => {

  const ref = useRef();

  const { query } = useLocation();

  const [data, setData] = useState([]);

  useEffect(() => {
    ref.current && ref.current.submit({ type: query && query.type });
  }, []);

  if (!query.type) {
    return <MyEmpty height='100%' />;
  }

  return <>
    <div style={{ position: 'sticky', top: 0 }}>
      <MyNavBar title='采购单列表' />
    </div>
    <MyList
      ref={ref}
      api={orderList}
      data={data}
      getData={(value) => {
        setData(value.filter(item => item));
      }}>
      {
        data.map((item, index) => {
          return <MyCard
            key={index}
            className={styles.item}
            headerClassName={styles.headerClassName}
            bodyClassName={styles.bodyClassName}
            onClick={() => {
              history.push(`/Work/Order/Detail?id=${item.orderId}`);
            }}
            titleBom={(item.theme || '无主题') + ' / ' + item.coding}
            extraClassName={styles.extra}
            extra={MyDate.Show(item.createTime)}
          >
            <div>
              <Label className={styles.label}>甲方</Label>：{item.acustomer && item.acustomer.customerName}
            </div>
            <div>
              <Label className={styles.label}>乙方</Label>：{item.bcustomer && item.bcustomer.customerName}
            </div>
            <div>
              <Label className={styles.label}>创建人</Label>：{item.user && item.user.name}
            </div>
          </MyCard>;
        })
      }
    </MyList>
  </>;
};

export default Order;
