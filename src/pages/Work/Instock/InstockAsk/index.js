import React, { useRef, useState } from 'react';
import MyNavBar from '../../../components/MyNavBar';
import MySearch from '../../../components/MySearch';
import style from './index.less';
import { ScanningOutline } from 'antd-mobile-icons';
import { Tabs } from 'antd-mobile';
import MyEmpty from '../../../components/MyEmpty';
import ReceiptsInstock from './coponents/ReceiptsInstock';
import SkuInstock from './coponents/SkuInstock';

const InstockAsk = () => {

  const [key, setKey] = useState('receipts');

  const [searchValue, setSearchValue] = useState();

  const ref = useRef();

  const tabs = [
    { title: '单据', key: 'receipts' },
    { title: '物料', key: 'sku' },
  ];

  const content = () => {
    switch (key) {
      case 'receipts':
        return <ReceiptsInstock />;
      case 'sku':
        return <SkuInstock ref={ref} searchValue={searchValue} />;
      default:
        return <MyEmpty height='100%' />;
    }
  };

  return <div className={style.instockAsk}>
    <MyNavBar title='入库申请' />
    <div className={style.content}>
      <div className={style.search}>
        <MySearch
          value={searchValue}
          searchIcon={<ScanningOutline />}
          placeholder={`请输入相关${key === 'receipts' ? '单据' : '物料'}信息`}
          onChange={setSearchValue}
          onSearch={(value) => {
            if (!ref.current) {
              return;
            }
            ref.current.submit({ skuName: value });
          }}
          onClear={() => {
            ref.current.submit({ skuName: '' });
          }}
        />
      </div>
      <Tabs
        activeKey={key}
        onChange={key => {
          setSearchValue('');
          setKey(key);
        }}
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
      {content()}
    </div>
  </div>;

};

export default InstockAsk;
