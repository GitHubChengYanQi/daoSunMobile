import React, { useRef, useState } from 'react';
import MyNavBar from '../../components/MyNavBar';
import MySearch from '../../components/MySearch';
import Icon from '../../components/Icon';
import MyEmpty from '../../components/MyEmpty';
import style from './index.less';
import { Tabs } from 'antd-mobile';
import topStyle from '../../global.less';
import { ToolUtil } from '../../components/ToolUtil';
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons';
import { useBoolean } from 'ahooks';

const MyPicking = () => {


  const [key, setKey] = useState('receipts');

  const [searchValue, setSearchValue] = useState();

  const ref = useRef();

  const [screen,{setFalse,setTrue}] = useBoolean();

  const tabs = [
    { title: '单据', key: 'receipts' },
    { title: '物料', key: 'sku' },
  ];

  const content = () => {
    switch (key) {
      case 'receipts':
        return <MyEmpty />;
      case 'sku':
        return <MyEmpty />;
      default:
        return <MyEmpty />;
    }
  };

  return <div className={style.myPicking}>
    <MyNavBar title='我的领料' />
    <div className={style.content}>
        <MySearch
          searchIcon={<Icon type='icon-dibudaohang-saoma' />} placeholder='搜索'
          value={searchValue}
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
      <div className={topStyle.top}>
        <div
          className={topStyle.screen}
          id='screen'
          onClick={() => {
            if (screen) {
              setFalse();
            } else {
              document.getElementById('screen').scrollIntoView();
              setTrue();
            }
          }}
        >
          <div className={topStyle.stockNumber}>数量：<span>{1}</span></div>
          <div
            className={ToolUtil.classNames(topStyle.screenButton, screen ? topStyle.checked : '')}
          >
            筛选 {screen ? <CaretUpFilled /> : <CaretDownFilled />}
          </div>
        </div>
      </div>
      {content()}
    </div>
  </div>;

};

export default MyPicking;
