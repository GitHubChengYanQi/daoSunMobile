import React, { useState } from 'react';
import MyNavBar from '../../../components/MyNavBar';
import { Tabs } from 'antd-mobile';
import styles from './index.less';
import Order from './components/Order';
import BottomButton from '../../../components/BottomButton';
import { useHistory } from 'react-router-dom';
import Plan from './components/Plan';

const PreProduction = () => {

  const history = useHistory();

  const [checkedSkus, setCheckedSkus] = useState([]);

  return <>
    <MyNavBar title='待生产' />
    <div className={styles.tabs}>
      <Tabs
        activeLineMode='fixed'
        style={{
          '--fixed-active-line-width': '50%',
        }}
      >
        <Tabs.Tab destroyOnClose title='订单式生产' key='order'>
          <Order checkedSkus={checkedSkus} setCheckedSkus={setCheckedSkus} />
        </Tabs.Tab>
        <Tabs.Tab destroyOnClose title='计划式生产' key='plan'>
          <Plan checkedSkus={checkedSkus} setCheckedSkus={setCheckedSkus} />
        </Tabs.Tab>
      </Tabs>
    </div>

    <BottomButton
      only
      disabled={checkedSkus.length === 0}
      text='创建出库计划'
      onClick={() => {

        const contracts = [];

        checkedSkus.forEach(item => {
          const orderId = item.orderId;
          const orderIndex = contracts.indexOf(orderId);
          if (orderIndex === -1) {
            contracts.push({
              coding: item.orderResult?.contract?.coding,
              details: [{
                ...(item.skuResult || {}),
                purchaseNumber: item.purchaseNumber,
              }],
            });
          } else {
            contracts[orderIndex] = {
              ...contracts[orderIndex],
              details: [...contracts[orderIndex].details, {
                ...(item.skuResult || {}),
                purchaseNumber: item.purchaseNumber,
              }],
            };
          }
        });

        history.push({
          pathname: '/Work/Production/CreatePlan',
          search: 'detail',
          state: {
            contracts,
          },
        });
      }}
    />
  </>;
};

export default PreProduction;
