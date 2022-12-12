import React, { useState } from 'react';
import MyNavBar from '../../components/MyNavBar';
import MyList from '../../components/MyList';
import MyCard from '../../components/MyCard';
import styles from '../Production/index.less';
import { MyDate } from '../../components/MyDate';
import Label from '../../components/Label';
import { invoiceList } from './url';
import { AddOutline } from 'antd-mobile-icons';
import MyFloatingBubble from '../../components/FloatingBubble';
import { useHistory } from 'react-router-dom';

const Invoice = () => {

  const [data, setData] = useState([]);

  const history = useHistory();

  return <>
    <MyNavBar title='发票管理' />
    <MyList
      api={invoiceList}
      data={data}
      getData={(value) => {
        setData(value.filter(item => item));
      }}>
      {
        data.map((item, index) => {
          return <MyCard
            key={index}
            titleBom={'关联订单：' + item.coding}
            className={styles.item}
            headerClassName={styles.headerClassName}
            bodyClassName={styles.bodyClassName}
            extraClassName={styles.extra}
            extra={MyDate.Show(item.createTime)}
            onClick={() => {
              history.push({ pathname: '/Work/Invoice/InvoiceDetail', search: `invoiceBillId=${item.invoiceBillId}` });
            }}
          >
            <div>
              <Label className={styles.label}>名称</Label>：{item.name}
            </div>
            <div>
              <Label className={styles.label}>金额</Label>：{item.money} 人民币
            </div>
            <div>
              <Label className={styles.label}>发票日期</Label>：{item.invoiceDate}
            </div>
          </MyCard>;
        })
      }
    </MyList>

    <MyFloatingBubble>
      <AddOutline style={{ color: 'var(--adm-color-primary)' }} onClick={() => {
        history.push('/Work/Invoice/CreateInvoice');
      }} />
    </MyFloatingBubble>
  </>;
};

export default Invoice;
