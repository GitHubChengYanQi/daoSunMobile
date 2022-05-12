import React, { useEffect, useRef, useState } from 'react';
import MyList from '../../components/MyList';
import { Card, Space } from 'antd-mobile';
import { history, useLocation } from 'umi';
import { orderList } from './Url';
import MyNavBar from '../../components/MyNavBar';
import Label from '../../components/Label';
import styles from '../Production/index.css';
import MyEmpty from '../../components/MyEmpty';

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
          return <Card
            key={index}
            className={styles.item}
            onClick={() => {
              history.push(`/Work/Order/Detail?id=${item.orderId}`);
            }}
          >
            <Space direction='vertical'>
              <div>
                <Label>采购单编号：</Label>{item.coding}
              </div>
              <div>
                <Label>甲方：</Label>{item.acustomer && item.acustomer.customerName}
              </div>
              <div>
                <Label>乙方：</Label>{item.bcustomer && item.bcustomer.customerName}
              </div>
              <div>
                <Label>创建人：</Label>{item.user && item.user.name}
              </div>
              <div>
                <Label>创建时间：</Label>{item.createTime}
              </div>
            </Space>
          </Card>;
        })
      }
    </MyList>
  </>;
};

export default Order;
