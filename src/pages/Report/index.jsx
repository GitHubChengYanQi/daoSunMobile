import React, { useState } from 'react';
import style from './index.less';
import { Tabs } from 'antd-mobile';
import MyNavBar from '../components/MyNavBar';
import InStockReport from './InStockReport';
import OutStockReport from './OutStockReport';
import Comprehensive from './Comprehensive';
import { useRequest } from '../../util/Request';
import { formList } from '../components/FormLayout';
import { ReceiptsEnums } from '../Receipts';
import { MyLoading } from '../components/MyLoading';
import MaintenanceReport from './MaintenanceReport';
import AllocationReport from './AllocationReport';
import StockingReport from '@/pages/Report/StockingReport';

const Report = () => {

  const [layout, setLayout] = useState([]);

  const { loading: detailLoaidng } = useRequest({
    ...formList,
    data: { formType: ReceiptsEnums.report },
  }, {
    onSuccess: (res) => {
      if (res[0]?.typeSetting) {
        const typeSetting = JSON.parse(res[0].typeSetting) || {};
        setLayout(typeSetting);
      }
    },
  });

  const [key, setKey] = useState(localStorage.getItem('reportkey') || 'inStock');

  if (detailLoaidng) {
    return <MyLoading skeleton />;
  }

  return <div className={style.report}>
    <MyNavBar noDom title='数据统计' />
    <Tabs className={style.tabs} stretch={false} activeKey={key} onChange={(key) => {
      localStorage.setItem('reportkey', key);
      setKey(key);
    }}>
      <Tabs.Tab title='入库' key='inStock' destroyOnClose>
        <InStockReport layout={layout['inStock']} />
      </Tabs.Tab>
      <Tabs.Tab title='出库' key='outStock' destroyOnClose>
        <OutStockReport layout={layout['outStock']} />
      </Tabs.Tab>
      <Tabs.Tab title='盘点' key='stocktaking' destroyOnClose>
        <StockingReport layout={layout['stocktaking']} />
      </Tabs.Tab>
      <Tabs.Tab title='养护' key='maintenance' destroyOnClose>
        <MaintenanceReport layout={layout['curring']} />
      </Tabs.Tab>
      <Tabs.Tab title='调拨' key='allocation' destroyOnClose>
        <AllocationReport layout={layout['allocation']} />
      </Tabs.Tab>
      <Tabs.Tab title='综合' key='comprehensive' destroyOnClose>
        <Comprehensive layout={layout['comprehensive']} />
      </Tabs.Tab>
    </Tabs>
  </div>;
};

export default Report;
