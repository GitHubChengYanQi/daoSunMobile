import React, { useState } from 'react';
import MyNavBar from '../../../components/MyNavBar';
import MySearch from '../../../components/MySearch';
import style from './index.less';
import { ScanningOutline } from 'antd-mobile-icons';
import { Tabs } from 'antd-mobile';
import MyEmpty from '../../../components/MyEmpty';
import ReceiptsInstock from './coponents/ReceiptsInstock';
import SplitDiv from '../../../components/SplitDiv';

const InstockAsk = () => {

  const [key, setKey] = useState('receipts');


  const tabs = [
    { title: '单据', key: 'receipts' },
    { title: '物料', key: 'sku' },
  ];

  const content = () => {
    switch (key) {
      case 'receipts':
        return <ReceiptsInstock />;
      case 'sku':
        return <MyEmpty height='100%' />;
      default:
        return <MyEmpty height='100%' />;
    }
  };

  return <div style={{ height: '100%', overflow: 'hidden' }}>

    <SplitDiv id='instockAsk'>
      <div>
        <MyNavBar title='入库申请' />
        <div className={style.search}>
          <MySearch searchIcon={<ScanningOutline />} />
        </div>
        <Tabs
          activeKey={key}
          onChange={setKey}
          className={style.tab}
        >
          {
            tabs.map((item) => {
              return <Tabs.Tab
                className={key === item.key ? style.checkTabItem : style.tabItem}
                {...item}
              />;
            })
          }
        </Tabs>
      </div>
      {content()}
    </SplitDiv>
  </div>;

};

export default InstockAsk;
