import React, { useState } from 'react';
import MyNavBar from '../../components/MyNavBar';
import FormLayout from '../../components/FormLayout';
import { ReceiptsEnums } from '../../Receipts';
import MyCard from '../../components/MyCard';
import { Input } from 'antd-mobile';
import BottomButton from '../../components/BottomButton';
import { isArray } from '../../components/ToolUtil';
import styles from './index.less';
import Title from '../../components/Title';

const PurchaseAsk = () => {

  const [data, setData] = useState({});


  return <>
    <MyNavBar title='采购申请' />
    <FormLayout
      data={data}
      formType={ReceiptsEnums.purchaseOrder}
      fieldRender={(item) => {
        const required = item.required;
        return <MyCard
          titleBom={required && <Title className={styles.title}>{item.filedName}<span>*</span></Title>}
          title={item.filedName}
          extra={<Input
            className={styles.input}
            placeholder='请输入'
            onChange={(value) => {
              setData({ ...data, [item.key]: value });
            }}
          />}
        />;
      }}
    />
  </>;
};

export default PurchaseAsk;
