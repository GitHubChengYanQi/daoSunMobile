import React, { useState } from 'react';
import style from './index.less';
import { Tabs } from 'antd-mobile';
import MyNavBar from '../components/MyNavBar';
import InOutStock from './InOutStock';
import InStockReport from './InStockReport';
import OutStockReport from './OutStockReport';

const Report = () => {

  const [key, setKey] = useState('outStock');

  return <div className={style.report}>
    <MyNavBar noDom title='数据统计' />
    <Tabs className={style.tabs} stretch={false} activeKey={key} onChange={setKey}>
      <Tabs.Tab title='入库' key='inStock' destroyOnClose>
        <InStockReport />
      </Tabs.Tab>
      <Tabs.Tab title='出库' key='outStock' destroyOnClose>
        <OutStockReport />
      </Tabs.Tab>
      <Tabs.Tab title='盘点' key='stocktaking' destroyOnClose>
        <div style={{ padding: 24, backgroundColor: '#fff', borderRadius: 4 }}>
          库存统计
        </div>
      </Tabs.Tab>
      <Tabs.Tab title='养护' key='maintenance' destroyOnClose>
        <div style={{ padding: 24, backgroundColor: '#fff', borderRadius: 4 }}>
          库存统计
        </div>
      </Tabs.Tab>
      <Tabs.Tab title='调拨' key='allocation' destroyOnClose>
        <InOutStock />
      </Tabs.Tab>
      <Tabs.Tab title='综合' key='all' destroyOnClose>
        <div style={{ padding: 24, backgroundColor: '#fff', borderRadius: 4 }}>
          库存统计
        </div>
      </Tabs.Tab>
    </Tabs>
  </div>;
};

export default Report;
