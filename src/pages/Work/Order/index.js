import React, { useRef, useState } from 'react';
import MyList from '../../components/MyList';
import { history, useLocation } from 'umi';
import { orderList } from './Url';
import MyNavBar from '../../components/MyNavBar';
import Label from '../../components/Label';
import styles from '../Production/index.less';
import MyEmpty from '../../components/MyEmpty';
import MyCard from '../../components/MyCard';
import { MyDate } from '../../components/MyDate';
import MySearch from '../../components/MySearch';
import { isArray } from '../../../util/ToolUtil';
import { ProgressBar } from 'antd-mobile';

const Order = () => {

  const ref = useRef();

  const { query } = useLocation();

  const [data, setData] = useState([]);

  const [searchValue, setSearchValue] = useState();

  if (!query.type) {
    return <MyEmpty height='100%' />;
  }

  let infoData = {};

  switch (query.type) {
    case '1':
      infoData = {
        title: '采购单列表',
      };
      break;
    case '2':
      infoData = {
        title: '销售单列表',
      };
      break;
  }

  return <>
    <MyNavBar title={infoData.title} />
    <MySearch
      value={searchValue}
      onChange={setSearchValue}
      onSearch={(theme) => {
        ref.current.submit({ theme });
      }}
    />
    <div className={styles.space} />
    <MyList
      params={{ type: query.type }}
      ref={ref}
      api={orderList}
      data={data}
      getData={(value) => {
        setData(value.filter(item => item));
      }}>
      {
        data.map((item, index) => {

          let inStock = 0;
          let totalPrice = 0;

          isArray(item.detailResults).forEach(item => {
            totalPrice += item.purchaseNumber;
            inStock += item.inStockNumber;
          });

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
            <div hidden={query.type === '1'}>
              <Label className={styles.label}>甲方</Label>：{item.acustomer && item.acustomer.customerName}
            </div>
            <div hidden={query.type === '2'}>
              <Label className={styles.label}>乙方</Label>：{item.bcustomer && item.bcustomer.customerName}
            </div>
            <div>
              <Label className={styles.label}>创建人</Label>：{item.user && item.user.name}
            </div>
            <div hidden={query.type === '2'} className={styles.ProgressBar}>
              <Label className={styles.label}>入库进度</Label>：
              <div className={styles.percent}>
                <ProgressBar percent={Math.round((inStock / totalPrice) * 100) || 0} text />
              </div>
            </div>
          </MyCard>;
        })
      }
    </MyList>
  </>;
};

export default Order;
